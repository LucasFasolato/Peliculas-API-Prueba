//-- Variables --------------------------------------------------------------------------------------------------------------

const  btnAnterior = getId('btnAnterior'), btnSiguiente = getId('btnSiguiente'), modalBody = getId('modal-body'),
       modalFooter = getId('modal-footer'), btnClose = getId('btnClose'), btnBack = getId('btnBack'), 
       modalHeader = getId('modal-header'), modalSheet = getId('modalSheet'), headModal = getId("head-modal"),
       topRanked = getId('top-ranked'), topView = getId('top-view'),
       contenedor = getId('contenedor');

const   searchBar = document.getElementById('search-bar'), 
        searchButton = document.getElementById('search-button');
let allTitles = [];
let allIds = [];
let allPosters = [];
let resultadoBusqueda = [];
let foundTitles = [];
let foundIds = [];
let foundPosters = [];
let pagina = 1;
// si modo esta en 0 es pq se trabaja con TOP-VIEW si esta en 1 es pq se trabaja con TOP-RATED
let modo = 0;

// const contPelis = document.createElement('div');
// contPelis.setAttribute('id','cont-pelis');
// contPelis.setAttribute('class','contenedor');
// contenedor.appendChild(contPelis);

let total_pages, num=0;

//-- Events -----------------------------------------------------------------------------------------------------------------

topRanked.addEventListener('click', ()=> {
    pagina=1;
    cargarPeliculas('top_rated')
});
topView.addEventListener('click', ()=> {
    pagina=1;
    cargarPeliculas('popular')
});

searchButton.addEventListener('click', ()=> searchTitles());
searchBar.oninput = () => inputValue();

btnClose.addEventListener('click',  () => closeModal ());
btnBack.addEventListener('click',  () => closeModal ());
btnSiguiente.addEventListener('click', () => {
    if (pagina < total_pages){
        pagina += 1;
        if (modo === 0){
            cargarPeliculas('popular');
        } else if (modo === 1) {
            cargarPeliculas('top_rated');
        }
    }
});
btnAnterior.addEventListener('click', () => {
    if (pagina > 1){
        pagina -= 1;
        if (modo === 0){
            cargarPeliculas('popular');
        } else if (modo === 1) {
            cargarPeliculas('top_rated');
        }
    }
});

//-- Functions --------------------------------------------------------------------------------------------------------------

function getId(domElement) {
    return document.getElementById(domElement)
}

function timeFormat(time) {
    if(time<60) return `Duración: ${time} minutos`
    else if(time>60) {
        let hour = Math.floor(time/60)
        let min = time % 60
        return `Duración: ${hour}h ${min}m`
    }
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

function inputValue() {
    searchTitles();
};

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

    console.log(resultadoBusqueda);
    

    for (let i = 0; i < resultadoBusqueda.length; i++){
            foundTitles[cont] = allTitles [resultadoBusqueda[i]];
            foundIds[cont] = allIds [resultadoBusqueda[i]];
            foundPosters[cont] = allPosters [resultadoBusqueda[i]];
            cont++;
    }
    actualizarPeliculas();
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

async function searchTitles () {
    try {
        let type ='';        
        if (modo === 0){
            type='popular';
        } else if (modo === 1) {
            type ='top_rated';
        }
        resetArray();
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);
        const datos = await resp.json();
        for(let j=0; j<=19; j++){
            allTitles.push(datos.results[j].title.toUpperCase());
            allIds.push(datos.results[j].id);
            allPosters.push(datos.results[j].poster_path)
        } 
        console.log(allTitles);
        console.log(allIds);
        console.log(allPosters);
        if(searchBar.value !== ''){
            console.log(searchBar.value);
            compararInput(searchBar.value.toUpperCase());
        } else {
            if (modo === 0){
                cargarPeliculas('popular');
            } else if (modo === 1) {
                cargarPeliculas('top_rated');
            }
        }
    } catch (error) {
        console.log(error);
    }  
}


//---------------------------------------------------------------------------------------------------------------------------

async function openModal (id) {
    try {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR`);
        const datos = await resp.json();
        const isVisible = "is-visible";

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

        let idioma="";
        (datos.original_language === "en") ? idioma = newElement('p',"Idioma original: Inglés",['id','idioma-datos']) : idioma;
        const tagline = newElement('h6',datos.tagline,['id','tagline-datos']);
        const duracion = newElement('p',timeFormat(datos.runtime),['id','duracion-datos']);
        const valoracion = newElement('p',`Valoracion: ${datos.vote_average}`,['id','valoracion-datos']);
        const mirarAhora = newElement('a','',['href',datos.homepage,'target',"_blank",'id',"mirarAhora-datos", 'class',"w-100"]);
        const buttonMirarAhora = newElement('button','MIRAR AHORA',['type','button','class',"btn btn-lg btn-primary w-100 mx-0 mb-2"]);
        apChilds([[modalBody,idioma,duracion,valoracion],[modalHeader,tagline],[modalFooter,mirarAhora],[mirarAhora,buttonMirarAhora], ]);
        
        getId('modal-title').innerHTML = datos.title;
        getId('modal-info-peli').innerHTML = datos.overview;
        headModal.setAttribute("style", `background-image: 
        url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
        modalSheet.classList.add(isVisible);      
    } catch (error) {
        console.log(error);
    }  
}

//---------------------------------------------------------------------------------------------------------------------------

async function actualizarPeliculas() {
    try {
        let type ='';        
        if(!contenedor.classList.contains("contenedor")){
            contenedor.classList.add("contenedor")
        }
        if (modo === 0){
            type='popular';
        } else if (modo === 1) {
            type ='top_rated';
        }
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);   
            if(respuesta.status === 200) {
                let peliculas = '';
                const datos = await respuesta.json();
                total_pages = datos.total_pages;
                if(resultadoBusqueda.length >= 1){
                    for(let i=0; i< resultadoBusqueda.length ; i++) {
                    peliculas += `
                    <div class="pelicula" id=${foundIds[i]}>
                        <a  href="#" 
                            onclick ="closeModal();openModal(${foundIds[i]})">
                            <img class="poster" src="https://image.tmdb.org/t/p/w500/${foundPosters[i]}">
                            <h3 class="titulo">${foundTitles[i]}</h3>
                        </a>
                    </div>
                    `;
                    }
                    contenedor.innerHTML = peliculas;
                } else if (resultadoBusqueda.length == 0){
                    contenedor.classList.toggle("contenedor");
                    peliculas += `
                        <h2>No se han encontrado resultados para tu búsqueda..</h2>
                    `;
                    contenedor.innerHTML = peliculas;
                }
            } else if (respuesta.status === 401) {
                console.log("Error en la conexion. Bad keyAddress");
    
            } else if(respuesta.status === 404) {
                console.log("No se encontraron las peliculas solicitadas.");
            }

    } catch (error) {
        console.log(error);
    }
    
};

//---------------------------------------------------------------------------------------------------------------------------

async function cargarPeliculas(type) {
    try {
        if(type==='popular') {
            modo = 0;
        } else if(type==='top_rated') {
            modo = 1;
        }
        if(!contenedor.classList.contains("contenedor")){
            contenedor.classList.add("contenedor")
        }
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);   
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


cargarPeliculas('popular');

//---------------------------------------------------------------------------------------------------------------------------