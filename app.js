//-- Variables --------------------------------------------------------------------------------------------

const  btnAnterior = getId('btnAnterior'), btnSiguiente = getId('btnSiguiente'), modalBody = getId('modal-body'),
       modalFooter = getId('modal-footer'), btnClose = getId('btnClose'), btnBack = getId('btnBack'), 
       modalHeader = getId('modal-header'), modalSheet = getId('modalSheet');
let pagina = 1, total_pages, num=0;

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

//----------------------------------------------------------------------------------------------
  
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
        function bodyChild(input = []) {
            input.forEach(x=> modalBody.appendChild(x))
        }

        let idioma;
        (datos.original_language === "en") ? idioma = newElement('p',"Idioma original: Inglés",['id','idioma-datos']) : idioma
        const tagline = newElement('h6',datos.tagline,['id','tagline-datos'])
        const duracion = newElement('p',timeFormat(datos.runtime),['id','duracion-datos'])
        const valoracion = newElement('p',`Valoracion: ${datos.vote_average}`,['id','valoracion-datos'])
        
        modalHeader.appendChild(tagline);
        bodyChild([idioma,duracion,valoracion])

        //const mirarAhora = newElement('a','',['href',datos.homepage,'target',"_blank",'id',"mirarAhora-datos"])

        const mirarAhora = document.createElement("a");
        mirarAhora.setAttribute('href', `${datos.homepage}`);
        mirarAhora.setAttribute('target', "_blank");
        mirarAhora.setAttribute('id', "mirarAhora-datos");
        //modalFooter.appendChild(mirarAhora);


        //const mirarAhora = newElement('button','MIRAR AHORA',['type','button','class',"btn btn-lg btn-primary w-100 mx-0 mb-2"])

        const buttonMirarAhora = document.createElement("button");
        buttonMirarAhora.setAttribute('type', "button");
        buttonMirarAhora.setAttribute('class', "btn btn-lg btn-primary w-100 mx-0 mb-2");
        buttonMirarAhora.innerHTML = "MIRAR AHORA";
        //mirarAhora.appendChild(buttonMirarAhora);
        
        getId('modal-title').innerHTML = datos.title;
        getId('modal-info-peli').innerHTML = datos.overview;
        modalSheet.setAttribute("style", `background-image: url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
        modalSheet.classList.add(isVisible);      
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