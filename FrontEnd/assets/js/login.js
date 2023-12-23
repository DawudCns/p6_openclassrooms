/*********Constantes globales**********/

// 1. Récupérer l'élément DOM du formulaire de connexion
const loginForm = document.querySelector(".form .connection");

/**********Fonction de connexion et d'authentification des utilisateurs**********/
/**
 *
 */

// 2. Fonction asynchrone pour gérer le processus de connexion
async function login() {
  // 3.  récupérer les valeurs saisies par l'utilisateur dans les champs du formulaire de connexion
  const loginEmail = document.getElementById("email").value;
  const loginPassword = document.getElementById("password").value;

  // 4. objet utilisateur à insérer dans le corps de la requête POST
  const user = {
    email: loginEmail,
    password: loginPassword,
  };

  // 5. capturer les erreurs de la requête fetch
  try {
    // 6. Effectuer une requête POST avec les informations utilisateur
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // 7. vérifier la propriété 'ok' de la réponse HTTP et générer une exception en cas d'erreur
    if (response.ok) {
      // 8. récupérer les données de la réponse JSON
      const data = await response.json();
      const userdata = data.token;

      // 9. stocker le token utilisateur dans localStorage
      localStorage.setItem("user", userdata);

      // ce code vérifie si le token d'authentification de l'utilisateur (localStorage.user) correspond au token reçu du serveur (tokenUtilisateur)
      // S'ils correspondent, il redirige l'utilisateur vers la page "edit.html", suggérant que l'utilisateur est authentifié.

      // 10. vérifier la correspondance des tokens et rediriger l'utilisateur si authentifié
      if (localStorage.user === userdata) {
        document.location.href = "edit.html";
      }
      console.log(user);
      console.log(localStorage);
    } else {
      // 11. Afficjer un message d'erreur en cas d'informations incorrectes
      document.querySelector(".error").innerHTML =
        "Erreur dans l’identifiant ou le mot de passe";

      // 12. Lancer une exception en cas d'erreur HTTP
      throw new Error(
        "Erreur dans la requête POST. Statut: " + response.status
      );
    }
  } catch (error) {
    // 13. Gérer les erreurs capturées
    console.log(error.message);
  }
}

/**
 *
 */

// 14. attacher la fonction de connexion à l'événement de soumission du formulaire
loginForm.addEventListener("submit", function (event) {
  event.stopPropagation(); // 15. empêcher la propagation de l'événement de clic
  event.preventDefault(); // 16.  empêcher la soumission du formulaire de manière traditionnelle
  login(); // 17. appeler la fonction de connexion lorsque le formulaire est soumis
});
