import express from 'express'
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

const routes = express.Router()

const pointsController = new PointsController()
const itemsController = new ItemsController()


// Request param: Parâmetros que vêm junto com a rota e identificam um recurso
// Query param: ?chave=valor
// Request Body param: json geralmente

routes.get('/items', itemsController.index)

routes.post('/points', pointsController.create)
routes.get('/points/:id', pointsController.show)
routes.get('/points/', pointsController.index)

//padrões da comunidade para métodos de controllers: 
//index(listagem), show (exibir um único item), create, update e delete

export default routes