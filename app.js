//-- Variables --------------------------------------------------------------------------------------------------------------

const btnAnterior = getId('btnAnterior');
const btnSiguiente = getId('btnSiguiente');
const modalBody = getId('modal-body');
const modalFooter = getId('modal-footer'); 
const btnClose = getId('btnClose'); 
const btnBack = getId('btnBack'); 
const modalHeader = getId('modal-header'); 
const modalSheet = getId('modalSheet'); 
const contenedor = getId('contenedor');
const searchBar = document.getElementById('search-bar'); 
const searchButton = document.getElementById('search-button');
let allTitles = [];
let allIds = [];
let allPosters = [];
let resultadoBusqueda = [];
let foundTitles = [];
let foundIds = [];
let foundPosters = [];
let pagina = 1;
let total_pages;
let num=0;
let inputSearch = '';

//-- Events -----------------------------------------------------------------------------------------------------------------

searchButton.addEventListener('click', ()=> searchTitles());
// searchBar.oninput = () => inputValue();

btnClose.addEventListener('click',  () => closeModal ());
btnBack.addEventListener('click',  () => closeModal ());
btnSiguiente.addEventListener('click', () => {
    if (pagina < total_pages){
        pagina += 1;
        cargarPeliculas();
    }
});
btnAnterior.addEventListener('click', () => {
    if (pagina > 1){
        pagina -= 1;
        cargarPeliculas();
    }
});



searchBar.addEventListener('input', (x)=>{
    if(x.data !== null) {
        inputSearch += x.data
    } else {
        inputSearch = inputSearch.slice(0,-1)
    }

    async function getData() {
        let length = 0
        for (let i = 1; i < 999; i++) {
            const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${i}`);
            const datos = await resp.json();
            const filtered = datos.results.filter(x => {
                return x.title.includes(inputSearch)
            })
            filtered.forEach(x=> console.log(x.title))
            length += filtered.length
            //output.push(filtered)
            //console.log(length);
            if (length >= 20) {
                actualizarPeliculas(filtered)
                return
            }
            //console.log(filtered);
        }
        
    }
    
    getData()

})

//-- Functions --------------------------------------------------------------------------------------------------------------

function getId(domElement) {
    return document.getElementById(domElement)
}

function timeFormat(time) {
    if(time<60) return `Duración: ${time} minutos`
    else if(time>60) {
        let hour = Math.floor(time/60)
        let min = time % 60
        return `Duración: ${hour}h:${min}m`
    }
}

function example() {
    console.log("example");
}



function closeModal () {
    const isVisible = "is-visible", idioma = getId("idioma-datos"), duracion = getId("duracion-datos"), 
        tagline = getId("tagline-datos"), valoracion = getId("valoracion-datos"), mirarAhora = getId('mirarAhora-datos');
    modalSheet.classList.remove(isVisible);
    if (document.body.contains(duracion)){
        if (document.body.contains(idioma)) {
            modalBody.removeChild(idioma);
        }
        modalBody.removeChild(duracion);   
        modalHeader.removeChild(tagline);
        modalBody.removeChild(valoracion);
        if (document.body.contains(mirarAhora)) {
            modalFooter.removeChild(mirarAhora);
        }  
    }
    modalSheet.setAttribute("style", "background-image: none"); 
} 

// function inputValue() {
//     searchTitles();
// };

function compararInput (data) {
    resultadoBusqueda = [];
    resetFounds();
    let cont = 0, conta = 0;

    for (let m = 0; m < 20; m++){
        if(allTitles[m].includes(data)){
            resultadoBusqueda[conta] = m;
            conta++;
        } 
    }

    resultadoBusqueda.forEach( x => {
        foundTitles[cont] = allTitles [x];
            foundIds[cont] = allIds [x];
            foundPosters[cont] = allPosters [x];
            cont++;
    })
    actualizarPeliculas()
}

function resetArray() {
    allTitles = [];
    allIds = [];
    allPosters = [];
}

function resetFounds() {
    foundTitles = [];
    foundIds = [];
    foundPosters = [];
}

function newElement(domElement,info,attributes) {
    const element = document.createElement(domElement);
    info === '' ? info : element.innerHTML = `${info}`;
    for (let i = 0; i < attributes.length; i+=2) {
        element.setAttribute(attributes[i],attributes[i+1])
    }
    return element
}

function apChilds(input = []) {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            j == 0 ? j : input[i][0].appendChild(input[i][j])
        }
    }
}

// async function searchTitles () {
//     try {
//         resetArray();
//         const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR`);
//         const datos = await resp.json();
//         //console.log(datos);
//         for(let j=0; j<=19; j++){
//             allTitles.push(datos.results[j].title.toUpperCase());
//             allIds.push(datos.results[j].id);
//             allPosters.push(datos.results[j].poster_path)
//         } 
//         //console.log(allTitles);
//         if(searchBar.value !== ''){
//             compararInput(searchBar.value.toUpperCase());
//         } else {
//             cargarPeliculas();
//         }
//     } catch (error) {
//         console.log(error);
//     }  
// }


//---------------------------------------------------------------------------------------------------------------------------

async function openModal (id) {
    try {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR`);
        const datos = await resp.json();
        const isVisible = "is-visible";
        let idioma;
        (datos.original_language === "en") ? idioma = newElement('p',"Idioma original: Inglés",['id','idioma-datos']) : idioma;
        const tagline = newElement('h6',datos.tagline,['id','tagline-datos']);
        const duracion = newElement('p',timeFormat(datos.runtime),['id','duracion-datos']);
        const valoracion = newElement('p',`Valoracion: ${datos.vote_average}`,['id','valoracion-datos']);
        const mirarAhora = newElement('a','',['href',datos.homepage,'target',"_blank",'id',"mirarAhora-datos"]);
        const buttonMirarAhora = newElement('button','MIRAR AHORA',['type','button','class',"btn btn-lg btn-primary w-100 mx-0 mb-2"]);
        apChilds([[modalBody,idioma,duracion,valoracion],[modalHeader,tagline],[modalFooter,mirarAhora],[mirarAhora,buttonMirarAhora], ]);
        getId('modal-title').innerHTML = datos.title;
        getId('modal-info-peli').innerHTML = datos.overview;
        modalSheet.setAttribute("style", `background-image: 
        url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
        modalSheet.classList.add(isVisible);      
    } catch (error) {
        console.log(error);
    }  
}

//---------------------------------------------------------------------------------------------------------------------------

async function actualizarPeliculas(data) {
        if(!contenedor.classList.contains("contenedor")){
            contenedor.classList.add("contenedor")
        }
        let peliculas = '';
            for(let i=0; i< data.length ; i++) {
            peliculas += `
            <div class="pelicula" id=${data[i].id}>
                <a  href="#" 
                    onclick ="closeModal();openModal(${data[i].id})">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${data[i].backdrop_path}">
                    <h3 class="titulo">${data[i].title}</h3>
                </a>
            </div>
            `;
            }
            contenedor.innerHTML = peliculas;
};

//---------------------------------------------------------------------------------------------------------------------------

async function cargarPeliculas() {
    try {
        if(!contenedor.classList.contains("contenedor")){
            contenedor.classList.add("contenedor")
        }
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);   
        if(respuesta.status === 200) {
            let peliculas = '';
            const datos = await respuesta.json();
            total_pages = datos.total_pages;
            datos.results.forEach(pelicula => {
                peliculas += `
                <div class="pelicula" id=${pelicula.id}>
                    <a  href="#" 
                        onclick ="closeModal();openModal(${pelicula.id})">
                        <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                        <h3 class="titulo">${pelicula.title}</h3>
                    </a>
                </div>
                `;
            });
            contenedor.innerHTML = peliculas;

        } else if(respuesta.status === 401) {
            console.log("Error en la conexion. Bad keyAddress");

        } else if(respuesta.status === 404) {
            console.log("No se encontraron las peliculas solicitadas.");
        }

    } catch (error) {
        console.log(error);
    }
    
};


cargarPeliculas();

//---------------------------------------------------------------------------------------------------------------------------