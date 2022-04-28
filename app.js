let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const modalBody = document.getElementById('modal-body');
const btnClose = document.getElementById('btnClose');
btnClose.addEventListener('click',  () => closeModal ());

const btnBack = document.getElementById('btnBack');
btnBack.addEventListener('click',  () => closeModal ());

function closeModal () {
    const isVisible = "is-visible";
    console.log("CERRANDO...");
    document.getElementById('modalSheet').classList.remove(isVisible);
    const idioma = document.getElementById("idioma-datos");
    const duracion = document.getElementById("duracion-datos");
    const tagline = document.getElementById("tagline-datos");
    const valoracion = document.getElementById("valoracion-datos");
    console.log(document.body.contains(document.getElementById("duracion-datos")));
    if (document.body.contains(document.getElementById("duracion-datos"))){
        if (document.body.contains(document.getElementById("idioma-datos"))) {
            modalBody.removeChild(idioma);
        }
        modalBody.removeChild(duracion);   
        document.getElementById('modal-header').removeChild(tagline);
        modalBody.removeChild(valoracion);
    }
    document.getElementById('modalSheet').setAttribute("style", "background-image: none"); 
}

let total_pages;
let num=0;

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
        document.getElementById('modal-header').appendChild(tagline);

        const idioma = document.createElement("p");
        if (datos.original_language === "en") {
            idioma.innerHTML = "Idioma original: Inglés";
            idioma.setAttribute('id', "idioma-datos");
            modalBody.appendChild(idioma);
        }

        const duracion = document.createElement("p");
        duracion.innerHTML = `Duracion: ${datos.runtime} minutos`;
        duracion.setAttribute('id', "duracion-datos");
        modalBody.appendChild(duracion);
        
        const valoracion = document.createElement("p");
        valoracion.innerHTML = `Valoracion: ${datos.vote_average}`;
        valoracion.setAttribute('id', "valoracion-datos");
        modalBody.appendChild(valoracion);
        // parrafo.innerHTML = "HOLA";
        // parrafo.setAttribute('id', "parrafo-datos");
        // const img = document.createElement("img");
        // img.setAttribute('id', "img-datos");
        // img.src = `https://image.tmdb.org/t/p/w500/${datos.backdrop_path}`;
        // img.alt = "FONDO"
        // let modall = document.getElementById('modalSheet');
        // modall.setAttribute('style', `backgroundImage = url ("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}")`);
        document.getElementById('modalSheet').setAttribute("style", `background-image: url("https://image.tmdb.org/t/p/w500/${datos.backdrop_path}");background-repeat: no-repeat;background-size: cover`);
        // modalBody.appendChild(parrafo);
        // modalBody.appendChild(img);
        // document.getElementById('modalSheet').style.backgroundImage ="url (`https://image.tmdb.org/t/p/w500/${datos.backdrop_path}`)";
        document.getElementById('modal-title').innerHTML = datos.title;
        document.getElementById('modal-info-peli').innerHTML = datos.overview;
        document.getElementById('modalSheet').classList.add(isVisible);      
    } catch (error) {
        console.log(error);
    }  
      
}

// function closeModal () {
//     const isVisible = "is-visible";
//     console.log("CERRANDO...");
//     document.getElementById('modalSheet').classList.remove(isVisible);
// }

const cargarPeliculas = async () => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);
        console.log(respuesta);
        
        if(respuesta.status === 200) {
            let peliculas = '';
            const datos = await respuesta.json();
            console.log(datos);
            total_pages = datos.total_pages;
            // href="./pelicula-info.html?id=${pelicula.id}"
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
            // pelicula.addEventListener('click', function () {
            //     window.location.href=`./pelicula-info.html`
            // })
            document.getElementById('contenedor').innerHTML = peliculas;

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