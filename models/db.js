const Sequelize = require('sequelize')

//conexão com o  banco
    const sequelize = new Sequelize('sistemadecadastro', 'root', 'root', {
    host: "localhost",
    dialect: 'mysql'
    })

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
