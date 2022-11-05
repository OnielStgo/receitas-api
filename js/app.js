function iniciarApp(){

  const resultado = document.querySelector('#resultado');
  const modal = new bootstrap.Modal('#modal', {})

  const selectCategorias = document.querySelector('#categorias');

  if(selectCategorias){
    selectCategorias.addEventListener('change', selecionarCategoria);
    obtenerCategorias();
  }

  const favoritosDiv = document.querySelector('.favoritos');

  if (favoritosDiv) {
    obtenerFavoritos()
  }

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
      receitaImagem.alt = `Imagem da receita: ${strMeal ?? receita.titulo}`;
      receitaImagem.src = strMealThumb ?? receita.img;

      const receitaCardBody = document.createElement('div');
      receitaCardBody.classList.add('card-body');

      const receitaHeading = document.createElement('h3');
      receitaHeading.classList.add('card-title', 'mb-3')
      receitaHeading.textContent = strMeal ?? receita.titulo;

      const receitaButton = document.createElement('button');
      receitaButton.classList.add('btn', 'btn-danger', 'w-100');
      receitaButton.textContent = 'Ver receita';
      // receitaButton.dataset.bsTarget = "#modal";
      // receitaButton.dataset.bsToggle = "modal";
      receitaButton.onclick = function(){
        selecionarReceita(idMeal ?? receita.id);
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
      <h3 class="my-3">Ingredientes e quantidades</h3>
    `;

    //mostrar ingredientes e quantidades
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');

    for (let i = 0; i < 20; i++) {
      if (receita[`strIngredient${i}`]) {
        const ingrediente = receita[`strIngredient${i}`];
        const quantidade = receita[`strMeasure${i}`];

        const ingredienteLi = document.createElement('li');
        ingredienteLi.classList.add('list-group-item');
        ingredienteLi.textContent = `${ingrediente} - ${quantidade}`;

        listGroup.appendChild(ingredienteLi)

      }
    }
    
    modalBody.appendChild(listGroup);

    //botões de Salvar no Favoritos e Cerrar
    const modalFooter = document.querySelector('.modal-footer');
    limparHTML(modalFooter);

    const btnFavorito = document.createElement('button');
    btnFavorito.classList.add('btn', 'btn-danger', 'col');
    btnFavorito.textContent = existeElementoNoStorage(idMeal) ? "Eliminar dos Favoritos" : "Salvar nos Favoritos";

    btnFavorito.onclick = function () {

      if (existeElementoNoStorage(idMeal)) {
        eliminarElementoDoStorage(idMeal);
        btnFavorito.textContent = "Salvar nos Favoritos";
        mostrarToast("Receita eliminada");
        return;
      }

      adicionarFavorito({
        id: idMeal,
        titulo: strMeal,
        img: strMealThumb
      });

      btnFavorito.textContent = "Eliminar dos Favoritos";
      mostrarToast("Receita adicionada");
    }

    const btnFechar = document.createElement('button');
    btnFechar.classList.add('btn', 'btn-secondary', 'col');
    btnFechar.textContent = "Fechar";
    btnFechar.onclick = function () {
      modal.hide();
    }

    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnFechar);

    //mostar o modal
    modal.show()
  }

  function adicionarFavorito(receita) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    localStorage.setItem("favoritos", JSON.stringify([...favoritos, receita]));
  }

  function existeElementoNoStorage(id){
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    return favoritos.some(favorito => favorito.id === id);
  }

  function mostrarToast(mensagem){
    const toastDiv = document.querySelector('#toast');
    const toastBody = document.querySelector('.toast-body');
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensagem;
    toast.show();
  }

  function eliminarElementoDoStorage(id){
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    const novosFavoritos = favoritos.filter(favorito => favorito.id !== id);
    localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
  }

  function obtenerFavoritos(){
   const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
   
   if (favoritos.length) {
    
    mostrarReceitas(favoritos)
    return;
   }

   const naoHaFavoritos = document.createElement('p');
   naoHaFavoritos.classList.add('fs-4', 'text-center', 'mt-5');
   naoHaFavoritos.textContent = "Não existem favoritos";
   resultado.appendChild(naoHaFavoritos);
  }

  function limparHTML(seletor){
    while (seletor.firstChild) {
      seletor.removeChild(seletor.firstChild)
    }
  }


}

document.addEventListener('DOMContentLoaded', iniciarApp);