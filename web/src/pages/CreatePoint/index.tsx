import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}
const CreatePoint = () => {

    //array ou objeto: precisamos manualmente informar o tipo da variável <tipo...>
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''        
    })


    const [selectedUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const history = useHistory()

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {

        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)

        })

    }, [])

    useEffect(() => {

        if (selectedUF === '0') return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)

            setCities(cityNames)

        })

    }, [selectedUF])

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(position => {

            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })

    }, [])

    function handleSelectUF(e: ChangeEvent<HTMLSelectElement>) {
        const uf = e.target.value
        setSelectedUF(uf)
    }

    function handleSelectCity(e: ChangeEvent<HTMLSelectElement>) {
        const city = e.target.value
        setSelectedCity(city)
    }

    function handleMapClick(e: LeafletMouseEvent) {

        const { lat, lng } = e.latlng

        setSelectedPosition([
            lat,
            lng
        ])
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>){
        
        const {name,value} = e.target
        
        //seta o estado com o valor anterior, substituindo somente a propriedade que foi passada como argumento
        setFormData({...formData, [name] : value})        
    }

    function handleSelectItem(id : number) {
        
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)

        } else {
            setSelectedItems([...selectedItems,id])
        }

    }

    async function handleSubmit(e: FormEvent) {
        
        e.preventDefault()
        
        const {name, email, whatsapp} = formData
        const uf = selectedUF
        const city = selectedCity
        const[latitude,longitude] = selectedPosition
        const items = selectedItems
        
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items 
        }

        await api.post('points', data)

        alert('Ponto de coleta criado com sucesso!')

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    {<FiArrowLeft />}
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>

                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>

                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUF}
                                onChange={handleSelectUF}>

                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => {
                                    return <option key={uf} value={uf}>{uf}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity} //posso passar a função direto, pois o event é passado automaticamente quando se usa o onChange
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => {
                                    return <option key={city} value={city}>{city}</option>
                                })}
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => {
                            return (
                                <li 
                                    key={item.id} 
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            )
                        })}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint