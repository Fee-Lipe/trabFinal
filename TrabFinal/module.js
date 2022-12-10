function inicializa_mapeamento(employeeTables, employees) {
    // Inicializa o mapa de funcionários com o número de mesas que cada funcionário está atendendo
    for (let employee of employees) {
      employeeTables.set(employee, 0);
    }
  }
  
  
  function assignTable(customerName,  employeeTables, employees, tables) {
      //Liga o cliente à um funcionário e à uma mesa. Caso não haja funcionário livre, atribui aquele que
      //estiver atendendo o menor número de clientes
      const availableTables = [];
      for (let i = 1; i <= 10; i++) {
        availableTables.push(i);
      }
      
      for (const [customerName, table] of tables) {
        const tableNumber = table.tableNumber;
        const index = availableTables.indexOf(tableNumber);
        if (index > -1) {
          availableTables.splice(index, 1);
        }
      }
      
      if (availableTables.length === 0) {
        console.log("Não há mesas disponíveis!");
        return false;
      }
      
      const randomIndex = Math.floor(Math.random() * availableTables.length);
      const tableNumber = availableTables[randomIndex];
       
      for (const employee of employees) {
        const numTables = employeeTables.get(employee);
        if (numTables === 0) {
          tables.set(customerName, { tableNumber, client: customerName, employee: employee });
          employeeTables.set(employee, numTables + 1);
          return true;
        }
      }
       
      //Se todos os funcionários já estiverem atendendo
      let minEmployee = null;
      let minTables = Number.MAX_VALUE;
      for (const [employee, numTables] of employeeTables) {
        if (numTables < minTables) {
          minEmployee = employee;
          minTables = numTables;
        }
      }
       
      tables.set(customerName, { tableNumber, client: customerName, employee: minEmployee });
      employeeTables.set(minEmployee, minTables + 1);
  }
      
  function freeTable(tableNumber, employeeTables, tables) {
      //Libera a mesa e o funcionário para quando o cliente deslogar de sua conta, decrementando 
      //o numero de mesas que o funcionário está atendendo
      for (const [customerName, table] of tables) {
        if (table.tableNumber === tableNumber) {
          tables.delete(customerName);
          const employee = table.employee;
          const numTables = employeeTables.get(employee);
          employeeTables.set(employee, numTables - 1);
          return;
        }
      }
  }
  

  module.exports.inicializa_mapeamento = inicializa_mapeamento;
  module.exports.assignTable = assignTable
  module.exports.freeTable = freeTable
