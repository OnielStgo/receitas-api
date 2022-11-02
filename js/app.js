function iniciarApp(){

  const resultado = document.querySelector('#resultado');
  const modal = new bootstrap.Modal('#modal', {})

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

    limparHTML(resultado);

    const heading = document.createElement('h2');
    heading.classList.add('text-center', 'text-black', 'my-5');
    heading.textContent = receitas.length ? "Resultados" : "Não há resultados";
    resultado.appendChild(heading);
        
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
      // receitaButton.dataset.bsTarget = "#modal";
      // receitaButton.dataset.bsToggle = "modal";
      receitaButton.onclick = function(){
        selecionarReceita(idMeal);
      }

      receitaCardBody.appendChild(receitaHeading);
      receitaCardBody.appendChild(receitaButton);

      receitaCard.appendChild(receitaImagem);
      receitaCard.appendChild(receitaCardBody);

      receitaContenedor.appendChild(receitaCard);
      
      resultado.appendChild(receitaContenedor);
    })
  }

  function selecionarReceita(id){
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
      .then(resposta => resposta.json())
      .then(resultado => mostrarReceitaModal(resultado.meals[0]))
  }

  function mostrarReceitaModal(receita) {
    const { idMeal, strInstructions, strMeal, strMealThumb } = receita;
    
    const modalTitle = document.querySelector('.modal .modal-title');
    const modalBody = document.querySelector('.modal .modal-body');

    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `<img class="img-fluid" src="${strMealThumb}" alt="receita ${strMeal}" />
      <h3 class="my-3">Instruções</h3>
      <p>${strInstructions}</p>
    `;


    //mostar o modal
    modal.show()
  }

  function limparHTML(seletor){
    while (seletor.firstChild) {
      seletor.removeChild(seletor.firstChild)
    }
  }


}

document.addEventListener('DOMContentLoaded', iniciarApp);