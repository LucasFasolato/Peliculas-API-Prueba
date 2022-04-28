//-- Variables --------------------------------------------------------------------------------------------

const btnAnterior = getId('btnAnterior');
const btnSiguiente = getId('btnSiguiente');
const modalBody = getId('modal-body');
const modalFooter = getId('modal-footer');
const btnClose = getId('btnClose');
const btnBack = getId('btnBack');
let pagina = 1;
let total_pages;
let num=0;

//-- Events --------------------------------------------------------------------------------------------

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

//-- Functions --------------------------------------------------------------------------------------------

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

function closeModal () {
    const isVisible = "is-visible";
    console.log("CERRANDO...");
    getId('modalSheet').classList.remove(isVisible);
    const idioma = getId("idioma-datos");
    const duracion = getId("duracion-datos");
    const tagline = getId("tagline-datos");
    const valoracion = getId("valoracion-datos");
    const mirarAhora = getId('mirarAhora-datos');
    if (document.body.contains(duracion)){
        if (document.body.contains(idioma)) {
            modalBody.removeChild(idioma);
        }
        modalBody.removeChild(duracion);   
        getId('modal-header').removeChild(tagline);
        modalBody.removeChild(valoracion);
        if (document.body.contains(mirarAhora)) {
            modalFooter.removeChild(mirarAhora);
        }  
    }
    getId('modalSheet').setAttribute("style", "background-image: none"); 
}

//----------------------------------------------------------------------------------------------
  
async function openModal (id) {
    try {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR`);
        console.log(resp);
        const datos = await resp.json();
        console.log(datos);
        const isVisible = "is-visible";
        console.log("ABRIENDO...");

        const tagline = document.createElement("h6");
        tagline.innerHTML = `${datos.tagline}`;
        tagline.setAttribute('id', "tagline-datos");
        getId('modal-header').appendChild(tagline);

        const idioma = document.createElement("p");
        if (datos.original_language === "en") {
            idioma.innerHTML = "Idioma original: Inglés";
            idioma.setAttribute('id', "idioma-datos");
            modalBody.appendChild(idioma);
        }

        const duracion = document.createElement("p");
        duracion.innerHTML = timeFormat(datos.runtime)
        duracion.setAttribute('id', "duracion-datos");
        modalBody.appendChild(duracion);
        
        const valoracion = document.createElement("p");
        valoracion.innerHTML = `Valoracion: ${datos.vote_average}`;
        valoracion.setAttribute('id', "valoracion-datos");
        modalBody.appendChild(valoracion);

        // const mirarAhora = document.createElement("a");
        // mirarAhora.setAttribute('href', `${datos.homepage}`);
        // mirarAhora.setAttribute('target', "_blank");
        // mirarAhora.setAttribute('id', "mirarAhora-datos");
        // modalFooter.appendChild(mirarAhora);

        // const buttonMirarAhora = document.createElement("button");
        // buttonMirarAhora.setAttribute('type', "button");
        // buttonMirarAhora.setAttribute('class', "btn btn-lg btn-primary w-100 mx-0 mb-2");
        // buttonMirarAhora.innerHTML = "MIRAR AHORA";
        // mirarAhora.appendChild(buttonMirarAhora);
        
        getId('modalSheet').setAttribute("style", `background-image: url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
        getId('modal-title').innerHTML = datos.title;
        getId('modal-info-peli').innerHTML = datos.overview;
        getId('modalSheet').classList.add(isVisible);      
    } catch (error) {
        console.log(error);
    }  
      
}

//----------------------------------------------------------------------------------------------

const cargarPeliculas = async () => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);
        console.log(respuesta);
        
        if(respuesta.status === 200) {
            let peliculas = '';
            const datos = await respuesta.json();
            console.log(datos);
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
            getId('contenedor').innerHTML = peliculas;

        } else if(respuesta.status === 401) {
            console.log("Error en la conexion. Bad keyAddress");

        } else if(respuesta.status === 404) {
            console.log("No se encontraron las peliculas solicitadas.");
        }

    } catch (error) {
        console.log(error);
    }
    
}



cargarPeliculas ();

//----------------------------------------------------------------------------------------------