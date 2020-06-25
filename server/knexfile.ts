import path from 'path'

module.exports = {
    client: "sqlite3",
    connection: { //diretório que contém o banco de dados
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    migrations: { //diretório que contém as migrations
        directory: path.resolve(__dirname,'src','database','migrations') 
    },
    useNullAsDefault: true,
    seeds: {
        directory: path.resolve(__dirname,'src','database','seeds') 
    }
}