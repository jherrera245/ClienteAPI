const URL_API = 'https://localhost:7023/api/Categorias/all'
const filas = document.querySelector('#filas')
const pagination = document.querySelector('.pagination')
const templateFilas = document.querySelector('#template-filas')
const templatePagination = document.querySelector('#template-pagination')
const fragment = document.createDocumentFragment(); //fragmento

const getCategorias = async(pageNumber, pageSize) => {
    const response = await fetch(URL_API + `?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    const data = response.json()
    return data
}

const load = async(page = 1, size = 7) => {
    const json = await getCategorias(page, size)

    let categorias = json.data
    let totalPages = parseInt(json.totalPages)
    let pageNumber = parseInt(json.pageNumber)
    //console.log(json)

    mostrarFilas(categorias)
    mostrarPaginacion(totalPages, pageNumber)
}

// agrega las filas a la tabla html
const mostrarFilas = (categorias) => {
    filas.textContent = ''
    let count = 0

    categorias.forEach(categoria => {
        count++
        const clone = templateFilas.content.cloneNode(true)
        clone.querySelector('.numero-registro').textContent = count
        clone.querySelector('.id').textContent = categoria.idCategoria
        clone.querySelector('.nombre').textContent = categoria.nombreCategoria
        clone.querySelector('.descripcion').textContent = categoria.descripcionCategoria
        clone.querySelector('.btn-editar').setAttribute('href', `editar.html?id=${categoria.idCategoria}`)
        clone.querySelector('.btn-eliminar').setAttribute('onClick', `eliminarCategoria(${categoria.idCategoria})`)
        fragment.appendChild(clone)
    })

    filas.appendChild(fragment)
}

const mostrarPaginacion = (totalPages, pageNumber) => {
    pagination.textContent = ''

    if (pageNumber > 1) {
        const clone = templatePagination.content.cloneNode(true)
        clone.querySelector('.page-link').textContent = `Anterior`
        clone.querySelector('.page-link').setAttribute('onClick', `load(${(pageNumber-1)}, 7)`)  
        fragment.appendChild(clone)  
    }
    
    //generando enlaces por numero de paginas
    for (let i = 0; i < totalPages; i++) {
        const clone = templatePagination.content.cloneNode(true)
        clone.querySelector('.page-link').textContent = `${i + 1}`
        clone.querySelector('.page-link').setAttribute('onClick', `load(${(i+1)}, 7)`)

        if (pageNumber == (i + 1)) {
            clone.querySelector('.page-link').setAttribute('class', 'page-link active')
        }

        fragment.appendChild(clone)
    }

    if (pageNumber != totalPages) {
        const clone = templatePagination.content.cloneNode(true)
        clone.querySelector('.page-link').textContent = `Siguiente`
        clone.querySelector('.page-link').setAttribute('onClick', `load(${(pageNumber+1)}, 7)`)  
        fragment.appendChild(clone)  
    }

    pagination.appendChild(fragment)
}

load()