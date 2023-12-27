// Import de la fonction getCategories depuis le fichier index.js
import { getCategories } from "./index.js";

/**********Constantes globales**********/

// Récupération des éléments DOM pour les modales, le formulaire, etc.
const firstModalContainer = document.querySelector(".modal-content"); // Conteneur de la première modal
const secondModalContainer = document.querySelector(".modal-add-project"); // Conteneur de la deuxième modal
const modalArrow = document.querySelector(".modal-arrow"); // Flèche pour revenir à la première modal

// Ajout d'un écouteur d'événement sur la flèche modale pour afficher la première modal
if (modalArrow !== null) modalArrow.addEventListener("click", firstModal);

const uploadImageForm = document.querySelector(".modal-upload-image-form"); // Formulaire de chargement d'image
const inputFile = document.createElement("input"); // Élément input pour le chargement d'image

// Ajout d'un écouteur d'événement sur le bouton "Ajouter" pour ouvrir la deuxième modal
const btnAdd = document.querySelector(".btn-add-project");
if (btnAdd !== null) btnAdd.addEventListener("click", openModalAdd);

const categorySelect = document.getElementById("modal-categories"); // Sélecteur de catégorie
const labelFile = document.querySelector(".modal-add-image-form"); // Étiquette pour le chargement d'image
const confirmBtn = document.querySelector(".modal-form-confirm-button"); // Bouton de confirmation du formulaire

const inputTitle = document.getElementById("modal-title-image"); // Champ de saisie du titre
const imgElement = document.createElement("img"); // Élément image pour prévisualiser l'image
imgElement.classList.add("img-uploaded"); // Ajout de classe pour le style

/**********Fonctions pour passer entre la première et la deuxième modale**********/

// Fonction pour afficher la première modal et cacher la deuxième modal
function firstModal() {
  firstModalContainer.style.display = "block";
  secondModalContainer.style.display = "none";
  resetForm();
}

// Fonction pour ouvrir la deuxième modal
async function openModalAdd() {
  firstModalContainer.style.display = "none";
  secondModalContainer.style.display = "block";

  // Configuration de l'input file pour la sélection d'image
  inputFile.type = "file";
  inputFile.id = "file";
  inputFile.name = "file";
  inputFile.accept = "image/png, image/jpeg";
  inputFile.style.display = "none";
  uploadImageForm.appendChild(inputFile);

  // Remplissage du menu déroulant des catégories
  await categoriesSelect();
}

async function categoriesSelect(categories) {
  // Effacer les options existantes et ajouter une option par défaut
  categorySelect.innerHTML = `<option value ="default" selected></option>`;
  try {
    // Récupérer les catégories depuis l'API et remplir le menu déroulant
    categories = await getCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function resetForm() {
  // Réinitialiser le style et le contenu de l'élément labelFile
  labelFile.style.padding = "30px 0 0";
  labelFile.innerHTML = `
    <img src="assets/icons/add-image.svg" alt="">
    <div class="modal-add-image-button">+ Add photo</div>
    <span class="modal-image-format">jpg, png: 4MB max</span>
  `;

  // Effacer le fichier sélectionné et la valeur
  inputFile.value = "";
  inputTitle.value = "";

  // Réinitialiser la valeur de "categorySelect" à la valeur par défaut
  categorySelect.value = "default";

  // Désactiver le bouton de confirmation et réinitialiser son style
  confirmBtn.disabled = true;
  confirmBtn.style.background = "#A7A7A7";
  confirmBtn.style.cursor = "auto";
}

function previewFile(event) {
  // vérifier si le fichier a une extension prise en charge (jpg ou png)
  //  /\.(jpe?g|png)$/i indique qu'elle correspond aux noms de fichiers se terminant par ".jpg" ou ".jpeg" ou ".png", indépendamment de la casse (grâce au modificateur "i")
  const fileExtensionRegex = /\.(jpe?g|png)$/i;

  // Étape 2: Vérifier si aucun fichier n'est sélectionné ou si le fichier sélectionné a un format non pris en charge
  if (
    inputFile.files.length === 0 ||
    !fileExtensionRegex.test(inputFile.files[0].name)
  ) {
    // Afficher une alerte pour le format non pris en charge, réinitialiser le formulaire
    alert("Format non pris en charge, merci de choisir une autre photo");
    resetForm();
    return;
  }

  // Étape 3: Si le format est pris en charge, obtenir le fichier, créer une URL pour l'image et appeler la fonction"displayImage"
  let file = event.target.files[0];
  let url = URL.createObjectURL(file);
  displayImage();

  function displayImage() {
    // Étape 1 : Supprimer le "padding" de l'élément labelFile
    labelFile.style.padding = "0px";

    // Étape 2 : Définir la source de l'élément imgElement sur l'URL créée pour l'image
    imgElement.src = url;

    // Étape 3 : Effacer le contenu de labelFile et ajouter imgElement
    labelFile.innerHTML = "";
    labelFile.appendChild(imgElement);
  }
}

inputFile.addEventListener("change", previewFile);

function switchConfirmBtnStyles() {
  // Vérifier si toutes les conditions nécessaires sont remplies pour activer le bouton de confirmation
  if (
    inputTitle.value !== "" &&
    categorySelect.value !== "default" &&
    inputFile.files.length > 0
  ) {
    // Appliquer les styles pour activer le bouton
    confirmBtn.style.background = "#1D6154";
    confirmBtn.disabled = false;
    confirmBtn.style.cursor = "pointer";
  } else {
    // Désactiver le bouton et appliquer les styles appropriés
    confirmBtn.disabled = true;
    confirmBtn.style.background = "#A7A7A7";
    confirmBtn.style.cursor = "auto";
  }
}

if (inputTitle !== null) {
  // Ajouter des écouteurs d'événements pour les changements dans les champs pertinents
  inputTitle.addEventListener("input", switchConfirmBtnStyles);
  categorySelect.addEventListener("input", switchConfirmBtnStyles);
  inputFile.addEventListener("input", switchConfirmBtnStyles);

  // Ajouter un écouteur d'événements pour le formulaire de téléchargement
  uploadImageForm.addEventListener("submit", addProject);
}

async function addProject(event) {
  // Empêcher le comportement de soumission par défaut, qui rechargerait la page
  event.preventDefault();

  // Créer un objet FormData pour construire facilement des paires clé/valeur pour les données du formulaire
  const formData = new FormData();
  formData.append("image", inputFile.files[0]); // Ajouter le fichier image sélectionné aux données du formulaire
  formData.append("title", inputTitle.value); // Ajouter le titre aux données du formulaire
  formData.append("category", categorySelect.value); // Ajouter la catégorie aux données du formulaire

  // Envoyer une requête POST au serveur
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        // Inclure le "Token" d'autorisation de l'utilisateur dans l'en-tête de la requête
        Authorization: "Bearer " + localStorage.user,
      },
      body: formData, // Inclure les données du formulaire dans le corps de la requête
    });

    // Vérifier si la réponse du serveur est réussie (code 200-299)
    if (response.ok) {
      // Si réussi, données de réponse en JSON
      const responseData = await response.json();

      console.log(responseData);
    } else {
      // Si réussi, parser les données de réponse en JSON
      console.error(
        "Échec d'ajout du projet. Le serveur a renvoyé une erreur:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    // Si une erreur se produit pendant la requête
    console.error(
      "Une erreur s'est produite lors du traitement de la requête:",
      error
    );
  }
}
