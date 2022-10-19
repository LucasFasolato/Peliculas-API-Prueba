//-- Variables --------------------------------------------------------------------------------------------------------------

const  btnAnterior = getId('btnAnterior'), btnSiguiente = getId('btnSiguiente'), modalBody = getId('modal-body'),
       modalFooter = getId('modal-footer'), btnClose = getId('btnClose'), btnBack = getId('btnBack'), 
       modalHeader = getId('modal-header'), modalSheet = getId('modalSheet'), headModal = getId("head-modal"),
       topRanked = getId('top-ranked'), topView = getId('top-view'), modalRecomendaciones = getId("modalRecomendaciones"),
       contenedor = getId('contenedor');

const   navContent = document.getElementById('nav-content'),
        searchBar = document.getElementById('search-bar'), 
        searchButton = document.getElementById('search-button'),
        buttonLuna = document.getElementById('button-luna'),
        buttonSol = document.getElementById('button-sol');
let pagina = 1;
// si modo esta en 0 es pq se trabaja con TOP-VIEW si esta en 1 es pq se trabaja con TOP-RATED
let modo = 0;
let modobusqueda = 0;
// let modonocturno = 1; //0 = noche , 1 = dia
let estadoNavResponsive= 0;
let total_pages, num=0;

//-- Events -----------------------------------------------------------------------------------------------------------------

buttonLuna.addEventListener('click', () => cambiarFondo(0));

buttonSol.addEventListener('click', () => cambiarFondo(1));

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
    if (modobusqueda === 1){
        if (pagina < total_pages){
            pagina += 1;
            searchTitles();
        }
    } else if (modobusqueda === 0) {
        if (pagina < total_pages){
            pagina += 1;
            if (modo === 0){
                cargarPeliculas('popular');
            } else if (modo === 1) {
                cargarPeliculas('top_rated');
            }
        }
    }
});
btnAnterior.addEventListener('click', () => {
    if (modobusqueda === 1){
        if (pagina > 1){
            pagina -= 1;
            searchTitles();
        }
    } else if (modobusqueda === 0) {
        if (pagina > 1){
            pagina -= 1;
            if (modo === 0){
                cargarPeliculas('popular');
            } else if (modo === 1) {
                cargarPeliculas('top_rated');
            }
        }
    }
    
});

//-- Functions --------------------------------------------------------------------------------------------------------------

function cambiarFondo (mood) {
    // if (mood === 1) {
    //     if(document.body.classList.contains('modo-noche')){
    //         document.body.classList.remove('modo-noche');
    //         document.body.classList.add('modo-dia');
    //         modalSheet.classList.remove('modo-noche');
    //         modalSheet.classList.add('modo-dia');
    //         modalBody.classList.remove('modo-noche');
    //         modalBody.classList.add('modo-dia');
    //         modalHeader.classList.remove('modo-noche');
    //         modalHeader.classList.add('modo-dia');
    //         // navContent.classList.remove('modo-dia');
    //         // navContent.classList.add('modo-noche');
    //     } else {
    //         document.body.classList.add('modo-dia');
    //         modalSheet.classList.add('modo-dia');
    //         modalBody.classList.add('modo-dia');
    //         modalHeader.classList.add('modo-dia');
    //         // navContent.classList.add('modo-noche');
    //     }
    // } else if (mood === 0) {
    //     if(document.body.classList.contains('modo-dia')){
    //         document.body.classList.remove('modo-dia');
    //         document.body.classList.add('modo-noche');
    //         modalSheet.classList.remove('modo-dia');
    //         modalSheet.classList.add('modo-noche');
    //         modalBody.classList.remove('modo-dia');
    //         modalBody.classList.add('modo-noche');
    //         modalHeader.classList.remove('modo-dia');
    //         modalHeader.classList.add('modo-noche');
    //         // navContent.classList.remove('modo-noche');
    //         // navContent.classList.add('modo-dia');
    //     } else {
    //         document.body.classList.add('modo-noche');
    //         modalSheet.classList.add('modo-noche');
    //         modalBody.classList.add('modo-noche');
    //         modalHeader.classList.add('modo-noche');
    //         // navContent.classList.add('modo-dia');
    //     }
    // }
}

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
    const visibility = "visibility";
    contenedor.classList.add(visibility);
    const isVisible = "is-visible", idioma = getId("idioma-datos"), duracion = getId("duracion-datos"), 
        tagline = getId("tagline-datos"), valoracion = getId("valoracion-datos"), mirarAhora = getId('mirarAhora-datos'), recomendaciones = getId('recomendacion-pelis');
    modalSheet.classList.remove(isVisible);
    modalRecomendaciones.classList.remove(isVisible);
    if (document.body.contains(duracion)){
        if (document.body.contains(idioma)) {
            modalBody.removeChild(idioma);
        }
        modalBody.removeChild(duracion);   
        modalHeader.removeChild(tagline);
        modalBody.removeChild(valoracion);
        modalBody.removeChild(recomendaciones);
        if (document.body.contains(mirarAhora)) {
            modalFooter.removeChild(mirarAhora);
        }  
    }
    modalSheet.setAttribute("style", "background-image: none");
} 

function inputValue() {
    if(searchBar.value === ""){
        modobusqueda = 0;
        if (modo === 0){
            cargarPeliculas('popular');
        } else if (modo === 1) {
            cargarPeliculas('top_rated');
        }
    } else {
        searchTitles();
    } 
};


//FUNCION PARA BUSCAR PELICULAS EN EL SEARCHBAR
async function searchTitles () {
    try {
        modobusqueda = 1;
        const respuesta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-MX&query=${searchBar.value}&page=${pagina}`);
        const datos = await respuesta.json();
        console.log(datos.total_results);
        if(respuesta.status === 200) {
            let peliculas = '';
            if(datos !== null){
                datos.results.forEach(pelicula => {
                    if(pelicula.poster_path !== null) {
                       peliculas += `
                        <div class="pelicula" id=${pelicula.id}>
                            <a  href="#" 
                                onclick ="closeModal();openModal(${pelicula.id})">
                                <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                                <h3 class="titulo">${pelicula.title}</h3>
                            </a>
                        </div>
                        `; 
                    }   
                });
                contenedor.innerHTML = peliculas;
            } else if (!datos.total_results){
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
}


//FUNCION PARA ABRIR EL MODAL CON LA ID CORRESPONDIENTE

async function openModal (id) {
    try {
        getId('modal-info-peli').innerHTML = "Cargando...";
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-MX`);
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
        (datos.original_language === "en") ? idioma = () => {
            newElement('p',"Idioma original: Inglés",['id','idioma-datos']);
            apChilds([modalBody, idioma]) 
        }: null;
        const tagline = newElement('h6',datos.tagline,['id','tagline-datos']);
        const duracion = newElement('p',timeFormat(datos.runtime),['id','duracion-datos']);
        const valoracion = newElement('p',`Valoracion: ${datos.vote_average}`,['id','valoracion-datos']);
        const recomendaciones = newElement('a',`Peliculas similares`,['id','recomendacion-pelis', 'class',"titulo cursor"]);
        const mirarAhora = newElement('a','',['href',datos.homepage,'target',"_blank",'id',"mirarAhora-datos", 'class',"w-100"]);
        const buttonMirarAhora = newElement('button','MIRAR AHORA',['type','button','class',"btn btn-lg btn-primary w-100 mx-0 mb-2"]);
        apChilds([[modalBody,duracion,valoracion, recomendaciones],[modalHeader,tagline],[modalFooter,mirarAhora],[mirarAhora,buttonMirarAhora], ]);
        
        getId('modal-title').innerHTML = datos.title;
        getId('modal-info-peli').innerHTML = datos.overview;
        recomendaciones.addEventListener('click', ()=> recomendacionPelis (id));
        if(datos.backdrop_path !== null) {
            headModal.setAttribute("style", `background-image: url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
            modalSheet.classList.add(isVisible); 

        } else {
            alert("Info no encontrada.");
        }
             
    } catch (error) {
        console.log(error);
    }  
}

async function recomendacionPelis (id) {
    try {
        const isVisible = "is-visible";
        const visibility = "visibility";
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-MX`);
        if(resp.status === 200) {
            let peliculas = '';
            const datos = await resp.json();
            datos.results.forEach(pelicula => {
                peliculas += `
                <div class="pelicula" id=${pelicula.id}>
                    <a  href="#" 
                        onclick ="closeModal();openModal(${pelicula.id})">
                        <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.backdrop_path}">
                        <h3 class="titulo">${pelicula.title}</h3>
                    </a>
                </div>
                `;
            });
            contenedor.classList.remove(visibility)
            modalRecomendaciones.innerHTML=peliculas;
            modalRecomendaciones.classList.add(isVisible);

        } else if(resp.status === 401) {
            console.log("Error en la conexion. Bad keyAddress");

        } else if(resp.status === 404) {
            console.log("No se encontraron las peliculas solicitadas.");
        }
             
    } catch (error) {
        console.log(error);
    }  
}

//---------------------------------------------------------------------------------------------------------------------------

async function cargarPeliculas(type) {
    try {
        const visibility = "visibility";
        if(type==='popular') {
            modo = 0;
        } else if(type==='top_rated') {
            modo = 1;
        }
        if(!contenedor.classList.contains("contenedor")){
            contenedor.classList.add("contenedor")
        }
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-MX&page=${pagina}`);   
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
            contenedor.classList.add(visibility);
            // contenedor.removeAttribute("style", "visibility: visible");
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