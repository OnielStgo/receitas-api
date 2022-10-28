function iniciarApp(){

  const selectCategorias = document.querySelector('#categorias')

  obtenerCategorias();

  function obtenerCategorias(){

    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    fetch(url)
      .then(resposta => resposta.json())
      .then(resultado => mostrarCategorias(resultado.categories))
  }

  function mostrarCategorias(categorias = []){
    categorias.forEach(categoria => {
      const { strCategory } = categoria
      const option = document.createElement('option');
      option.value = strCategory;
      option.textContent = categoria.strCategory;
      selectCategorias.appendChild(option);
    });
  }
}

document.addEventListener('DOMContentLoaded', iniciarApp);