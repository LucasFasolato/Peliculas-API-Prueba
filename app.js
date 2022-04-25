let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
let total_pages;
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
const cargarPeliculas = async () => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=81733fbe56cb4b598fe53cdb888c5fe8&language=es-AR&page=${pagina}`);
        console.log(respuesta);
        if(respuesta.status === 200) {
            let peliculas = '';
            const datos = await respuesta.json();
            total_pages = datos.total_pages;
            datos.results.forEach(pelicula => {
                peliculas += `
                <div class="pelicula">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                    <h3 class="titulo">${pelicula.title}</h3>
                </div>
                `;
            });

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