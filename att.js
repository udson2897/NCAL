
        const CONFIG = {
            supabaseUrl: "https://vvgtuaxymotjbkpqncln.supabase.co",
            supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3R1YXh5bW90amJrcHFuY2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjk4ODYsImV4cCI6MjA0OTcwNTg4Nn0.TRC3a7-2lRt7HLQD3ImnAZmWaiDa4HXtn_mnSIqZwHs",
            tableName: "requisicoes",
            get apiUrl() {
                return `${this.supabaseUrl}/rest/v1/${this.tableName}`;
            },
            get headers() {
                return {
                    "apikey": this.supabaseKey,
                    "Authorization": `Bearer ${this.supabaseKey}`,
                    "Content-Type": "application/json"
                };
            }
        };

        let tableData = [];
        const container = document.getElementById('tabela-container');

        function formatValue(value) {
            return value !== null && value !== undefined ? value : "";
        }

        function normalizeText(text) {
            return text ? String(text).trim().toLowerCase() : "";
        }

        function getRowClass(row) {
            const isUrgent = normalizeText(row.urgente) === "sim";
            const status = normalizeText(row.status_requisicao);

            if (status === "concluída") return "highlight-concluded";
            if (status === "em cotação") return "highlight-quotation";
            if (status === "cancelada") return "highlight-cancelled";
            if (status === "pedido enviado") return "highlight-sent";
            if (isUrgent) return "highlight-urgent";
            return "";
        }

        function updateValue(rowIndex, column, value) {
            tableData[rowIndex][column] = value;
            updateRowStyle(rowIndex);
        }

        function updateRowStyle(rowIndex) {
            const row = container.querySelector(`tr[data-index="${rowIndex}"]`);
            if (!row) return;

            row.classList.remove('highlight-urgent', 'highlight-concluded', 'highlight-quotation', 'highlight-cancelled', 'highlight-sent');
            
            const newClass = getRowClass(tableData[rowIndex]);
            if (newClass) {
                row.classList.add(newClass);
            }
        }

        function sortTableData(data) {
            return data.sort((a, b) => {
                const urgencyA = normalizeText(a.urgente) === "sim";
                const urgencyB = normalizeText(b.urgente) === "sim";

                const statusOrder = {
                    "": 1, // Status vazio no topo
                    "em cotação": 2,
                    "pedido enviado": 3,
                    "concluída": 4,
                    "cancelada": 5, // Sempre no final
                };

                const statusA = normalizeText(a.status_requisicao);
                const statusB = normalizeText(b.status_requisicao);

                if (urgencyA && statusA === "" && !(urgencyB && statusB === "")) return -1;
                if (!(urgencyA && statusA === "") && urgencyB && statusB === "") return 1;

                return (statusOrder[statusA] || 6) - (statusOrder[statusB] || 6);
            });
        }
        function deleteRow(rowIndex) {
            const row = tableData[rowIndex];
            if (!confirm("Tem certeza que deseja excluir esta requisição?")) return;
        
            fetch(`${CONFIG.apiUrl}?id=eq.${row.id}`, {
                method: "DELETE",
                headers: CONFIG.headers
            })
            .then(response => {
                if (response.ok) {
                    tableData.splice(rowIndex, 1);
                    renderTable();
                    alert("Requisição excluída com sucesso!");
                } else {
                    return response.text().then(text => {
                        throw new Error(`Erro do servidor: ${text}`);
                    });
                }
            })
            .catch(error => {
                alert(`Erro ao excluir a requisição: ${error.message}`);
            });
        }
        

        function generateTableHTML(data) {
            if (!data.length) return '<p>Nenhum dado encontrado</p>';

            const headers = Object.keys(data[0]);
            const rows = data.map((row, rowIndex) => {
                const cells = headers.map(header => {
                    if (header === "status_requisicao") {
                        return `<td>
                            <select onchange="updateValue(${rowIndex}, '${header}', this.value)">
                                <option value="" ${row[header] === "" ? "selected" : ""}></option>
                                <option value="em cotação" ${normalizeText(row[header]) === "em cotação" ? "selected" : ""}>Em cotação</option>
                                <option value="concluída" ${normalizeText(row[header]) === "concluída" ? "selected" : ""}>Concluída</option>
                                <option value="cancelada" ${normalizeText(row[header]) === "cancelada" ? "selected" : ""}>Cancelada</option>
                                <option value="pedido enviado" ${normalizeText(row[header]) === "pedido enviado" ? "selected" : ""}>Pedido Enviado</option>
                            </select>
                        </td>`;
                    } else if (header === "valor_requisicao") {
                        return `<td>
                            <input type="number" 
                                value="${formatValue(row[header])}" 
                                onchange="updateValue(${rowIndex}, '${header}', this.value)" 
                                max="100000" 
                                step="0.01"
                                style="width: 120px; text-align: right;"
                                placeholder="0,00"
                            />
                        </td>`;
                    } else if (header === "previsao_entrega" || header === "data_entrega") {
                        const inputType = "date";
                        return `<td>
                            <input type="${inputType}" 
                                value="${formatValue(row[header])}" 
                                onchange="updateValue(${rowIndex}, '${header}', this.value)"
                            />
                        </td>`;
                    }
                    return `<td>${formatValue(row[header])}</td>`;
                }).join('');

                return `
                    <tr class="${getRowClass(row)}" data-index="${rowIndex}">
                        ${cells}
                        <td><button onclick="saveRow(${rowIndex})">Salvar</button>&#160<button onclick="deleteRow(${rowIndex})" style="background-color: red; color: white;">Excluir</button></td>
                        
                    </tr>
                `;
            }).join('');

            return `
            <table>
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }
    

        function renderTable(data = tableData) {
            const sortedData = sortTableData(data);
            container.innerHTML = generateTableHTML(sortedData);
        }

        function saveRow(rowIndex) {
            const row = tableData[rowIndex];

            fetch(`${CONFIG.apiUrl}?id=eq.${row.id}`, {
                method: "PATCH",
                headers: CONFIG.headers,
                body: JSON.stringify(row)
            })
            .then(response => {
                if (response.ok) {
                    alert("Dados salvos com sucesso!");
                } else {
                    return response.text().then(text => {
                        throw new Error(`Erro do servidor: ${text}`);
                    });
                }
            })
            .catch(error => {
                alert(`Erro ao salvar os dados: ${error.message}`);
            });
        }

        function filterTable() {
            const searchTerm = normalizeText(document.getElementById("search").value);
            const selectedStatuses = Array.from(document.querySelectorAll(".status-filter:checked")).map(checkbox => normalizeText(checkbox.value));

            const filteredData = tableData.filter(row => {
                if (!isNaN(searchTerm) && searchTerm !== "") {
                    return row.id.toString() === searchTerm;
                }

                const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(normalizeText(row.status_requisicao)) || (selectedStatuses.includes("vazio") && normalizeText(row.status_requisicao) === "");
                const matchesSearch = Object.values(row).some(value => value && normalizeText(value).includes(searchTerm));

                return matchesStatus && matchesSearch;
            });
            renderTable(filteredData);
        }

        document.getElementById("search").addEventListener("input", filterTable);
        document.querySelectorAll(".status-filter").forEach(checkbox => {
            checkbox.addEventListener("change", filterTable);
        });

        fetch(CONFIG.apiUrl, { headers: CONFIG.headers })
            .then(response => response.json())
            .then(data => {
                tableData = data;
                renderTable();
            })
            .catch(error => {
                container.innerHTML = "Erro ao carregar os dados.";
            });
    
