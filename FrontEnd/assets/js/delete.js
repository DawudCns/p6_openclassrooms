// Importation de la fonction displayWorks depuis le fichier index.js
import { displayWorks } from "./index.js";

//*********Suppression des travaux existants*********//

// Fonction asynchrone pour supprimer les travaux
async function deleteWorks(event) {
  // 1. Empêche le comportement par défaut du clic
  event.preventDefault();

  // Arrête la propagation de l'événement pour éviter le rafraîchissement de la page
  event.stopPropagation();

  // 2. Récupère la valeur de l'attribut 'data-id' de l'élément HTML qui a déclenché l'événement (event)
  let id = event.target.dataset.id;
  console.log(id);

  // Affiche une confirmation de suppression
  const confirmation = confirm("Voulez-vous vraiment supprimer ce projet?");
  if (confirmation) {
    try {
      // 3. Envoie une requête DELETE à l'API
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: "Bearer " + localStorage.user,
        },
      });

      if (response.ok) {
        // 4. Supprime l'élément parent de l'icône de suppression (l'ensemble du conteneur de travail)
        const workContainer = event.target.closest(".work-container");
        workContainer.remove();

        // 5. Après la suppression, affiche les travaux mis à jour dans la galerie principale
        const mainGallery = document.querySelector(".gallery");
        displayWorks(mainGallery);
      } else if (response.status === "401") {
        // Alerte si la session a expiré et redirige vers la page de connexion
        alert("Session expirée, merci de vous reconnecter");
        document.location.href("login.html");
      } else {
        // Affiche une erreur en cas de problème avec la suppression
        const errorData = await response.json();
        console.error("Erreur dans la suppression d'un projet:", errorData);
      }
    } catch (error) {
      // Affiche une erreur en cas d'échec de la requête DELETE
      console.error("Erreur dans la supression d'un projet:", error);
    }
  } else {
    console.log("Suppression annulée");
  }
}

// Exporte la fonction deleteProject
export function deleteProject() {
  // Sélectionne tous les icônes de suppression modales et ajoute un écouteur d'événements pour la suppression
  let deleteIcons = document.querySelectorAll(".modal-delete-icon");
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", deleteWorks);
  });
}
