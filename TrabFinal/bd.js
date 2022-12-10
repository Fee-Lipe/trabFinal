const sqlite3 = require('sqlite3').verbose();

const bcrypt = require('bcrypt');

var modules = require('./module');

let db;

function inicializa_banco() {
        //Faz a conexão com o banco
        db = new sqlite3.Database('./Tabelas.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Conexão com o banco de dados SQLite estabelecida com sucesso.');
    });
    return db
}

function getProducts(Produtos) {
    //Pega todos os produtos e coloca em um array
    db.all('SELECT * FROM Produtos', (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        Produtos.push(row);
    });
  });
}

function getEmployees(employeeTables, employees) {
    //Pega todos os funcionários e coloca em um array
    db.all('SELECT nome FROM Funcionarios', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
          employees.push(row.nome);
        });
        modules.inicializa_mapeamento(employeeTables, employees)
      });
}

function isertPedidos(id_produtos_comprados, qtd_produtos_comprados, nome, obs) {
    //Insere os pedidos dos clientes no banco
    db.run(`INSERT INTO Pedido (nome_cliente, obs_pedido) VALUES (?, ?)`, [nome, obs], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Dados do usuário inseridos com sucesso!`);
        const id = this.lastID;
    
        for (let id_produto of id_produtos_comprados) {
          var qtd_individual = qtd_produtos_comprados[id_produtos_comprados.indexOf(id_produto)]
          db.run(`INSERT INTO Pedido_Produto (id_pedido, id_produto, qtd_individual) VALUES (?, ?, ?)`, [id, id_produto, qtd_individual], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Dados do usuário inseridos com sucesso! ID gerado: ${id}`);
        })
      }
      });
}

function insertClienteMesa(tableNumber, customerName, employee) {
    //Insere a mesa que o cliente está, o cliente e o funcionário que o está atendendo
    db.run(`INSERT INTO Cliente_Mesa (mesa, nome_cliente, nome_func) VALUES (?, ?, ?)`, [tableNumber, customerName, employee], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Dados do usuário inseridos com sucesso!`);
      });
}

function insertFaleConosco(nome, email, mensagem) {
    //Insere a mensagem que foi enviada pelo fale conosco
    db.run(`INSERT INTO Fale_Conosco (nome_cliente, email, mensagem) VALUES (?, ?, ?)`, [nome, email, mensagem], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Dados do usuário inseridos com sucesso!`);
      });
}


function verificaSenha(login, senha) {
    //Verifica se a senha armazenada em hash no banco é a mesma inserida pelo cliente
    db.get(`SELECT senha FROM Clientes WHERE usuario = ?`, [login], (err, linha) => {
        if (err) {
          return console.error(err.message);
        }
        if (linha) {
          let senhas_iguais = bcrypt.compareSync(senha, linha.senha)
          // Comparar a senha fornecida pelo usuário com a senha retornada pelo select
          console.log(senhas_iguais)
          console.log(linha.senha) 
          if (senhas_iguais) {
            console.log(senha)
            nome = login
            return true
          } else if (!senhas_iguais){
            return false
          }
        } else {
          return undefined
        }
      });
}



function insertCliente(nome, usuario, senha, email, jaCadastrou, deuCerto) {
    db.get(`SELECT senha FROM Clientes WHERE usuario = ?`, [usuario], (err, linha) => {
        if (err) {
          return console.error(err.message);
        }
        if (linha) {
            console.log('usuário já cadastrado')
            jaCadastrou = 'Usuario já cadastrado'
            deuCerto = false
        }
        else {
          // Gerar o hash da senha
          const saltRounds = 10
          const salt = bcrypt.genSaltSync(saltRounds);
          hash = bcrypt.hashSync(senha, salt)   
          console.log(hash) 
          db.run(`INSERT INTO clientes (nome, usuario, senha, email) VALUES (?, ?, ?, ?)`, [nome, usuario, hash, email], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Dados do usuário inseridos com sucesso!`);
          });
          deuCerto = true
        }
      })
}



module.exports.getProducts = getProducts

module.exports.inicializa_banco = inicializa_banco

module.exports.getEmployees = getEmployees

module.exports.isertPedidos = isertPedidos

module.exports.insertClienteMesa = insertClienteMesa

module.exports.verificaSenha = verificaSenha

module.exports.insertCliente = insertCliente

module.exports.insertFaleConosco = insertFaleConosco