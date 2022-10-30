function iniciarApp(){

  const resultado = document.querySelector('#resultado');
  const selectCategorias = document.querySelector('#categorias');
  selectCategorias.addEventListener('change', selecionarCategoria);

  

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

  function selecionarCategoria(e){
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    
    fetch(url)
      .then(resposta => resposta.json())
      .then(resultado => mostrarReceitas(resultado.meals))
  }

  function mostrarReceitas(receitas = []){
        
    receitas.forEach(receita => {
      const { idMeal, strMeal, strMealThumb } = receita;

      const receitaContenedor = document.createElement('div');
      receitaContenedor.classList.add('col-md-4');

      const receitaCard = document.createElement('div');
      receitaCard.classList.add('card', 'mb-4');

      const receitaImagem = document.createElement('img');
      receitaImagem.classList.add('card-img-top');
      receitaImagem.alt = `Imagem da receita: ${strMeal}`;
      receitaImagem.src = strMealThumb;

      const receitaCardBody = document.createElement('div');
      receitaCardBody.classList.add('card-body');

      const receitaHeading = document.createElement('h3');
      receitaHeading.classList.add('card-title', 'mb-3')
      receitaHeading.textContent = strMeal;

      const receitaButton = document.createElement('button');
      receitaButton.classList.add('btn', 'btn-danger', 'w-100');
      receitaButton.textContent = 'Ver receita';

      receitaCardBody.appendChild(receitaHeading);
      receitaCardBody.appendChild(receitaButton);

      receitaCard.appendChild(receitaImagem);
      receitaCard.appendChild(receitaCardBody);

      receitaContenedor.appendChild(receitaCard);
      
      resultado.appendChild(receitaContenedor);
    })
  }


}

document.addEventListener('DOMContentLoaded', iniciarApp);