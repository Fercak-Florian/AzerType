/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Cette fonction affiche le score de l'utilisateur sur la page
 * @param {number} score : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(score, nbMotsProposes) {
    // Récupération de la zone dans laquelle on va écrire le score
    let spanScore = document.querySelector(".zoneScore span")
    // Ecriture du texte
    let affichageScore = `${score} / ${nbMotsProposes}` 
    // On place le texte à l'intérieur du span. 
    spanScore.innerText = affichageScore
}

/**
 * Cette fonction affiche une proposition, que le joueur devra recopier, 
 * dans la zone "zoneProposition"
 * @param {string} motPropose : la proposition à afficher
 */
function afficherProposition (motPropose){
    let zoneProposition = document.querySelector(".zoneProposition")
    zoneProposition.innerHTML = motPropose 
}

/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nom : le nom de l'utilisateur
 * @param {string} email : l'email de la personne avec qui il veut partager son score
 * @param {string} score : le score. 
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`
    location.href = mailto
}

/**
 * Cette fonction prend un nom en paramètre et valide qu'il est au bon format
 * ici : deux caractères au minimum
 * @param {string} nom : le nom de l'utilisateur
 * @throws {Error}
 */
function validerNom(nom) {
    if(nom.length <= 2){
        throw new Error(`Le nom ${nom} est trop court`)
    }
}

/**
 * Cette fonction prend un email en paramètre et valide qu'il est au bon format. 
 * @param {string} email : email du destinataire
 * @throws {Error}
 */
function validerEmail(email) {
    let regexEmail = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    if(!regexEmail.test(email)){
        throw new Error(`L'email ${email} n'est pas valide`)
    }
}

/**
 * Cette fonction permet de récupérer les informations dans le formulaire
 * de la popup de partage et d'appeler l'affichage de l'email avec les bons paramètres.
 * @param {string} scoreEmail : une chaine de caractère contenant le score / le nombre de mots proposés
 */
function gererFormulaire(scoreEmail){
    try {
        let baliseNom = document.getElementById("nom")
        let nom = baliseNom.value
        validerNom(nom)
        
        let baliseEmail = document.getElementById("email")
        let email = baliseEmail.value
        validerEmail(email)
        
        afficherEmail(nom, email, scoreEmail)
        afficherMessageErreur("")
    } catch (error) {
        afficherMessageErreur(error.message)
    }
}

/**
 * Cette fonction affiche le message d'erreur passé en paramètre. 
 * Si le span existe déjà, alors il est réutilisé pour ne pas multiplier
 * les messages d'erreurs. 
 * @param {string} messageErreur : le message d'erreur que l'on veut afficher
 */
function afficherMessageErreur(messageErreur){
    
    let spanErreurMessage = document.getElementById("erreurMessage")  
    
    if(!spanErreurMessage){
        let popup = document.querySelector(".popup")  
        spanErreurMessage = document.createElement("span")
        spanErreurMessage.id = "erreurMessage"
        
        popup.append(spanErreurMessage)
    }
    spanErreurMessage.innerText = messageErreur  
}

/**
 * Cette fonction lance le jeu. 
 * Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
 */
 function lancerJeu(){
    initAddEventListenerPopup()
    let listeProposition = listeMot
    let score = 0
    let i = 0
    let inputEcriture = document.getElementById("inputEcriture")
    let btnValiderMot = document.getElementById("btnValiderMot")

    afficherProposition(listeMot[i])

    btnValiderMot.addEventListener("click", () => {
        if(inputEcriture.value === listeProposition[i]){
            score++
        } 
        i++
        afficherResultat(score, i)
        inputEcriture.value = ""
        if(listeProposition[i] === undefined){
            afficherProposition("Le jeu est fini")
            btnValiderMot.disabled = true
        } else {
            afficherProposition(listeProposition[i])
        }
    })

    // Gestion de l'événement change sur les boutons radios.
    let listeBtnRadio = document.querySelectorAll(".optionSource input")
    for (let j = 0; j < listeBtnRadio.length; j++){
        listeBtnRadio[j].addEventListener("change", (event) => {
            // Si c'est le premier élément qui a été modifié, alors nous voulons
            // jouer avec la listeMots. 
            if(event.target.value === "1"){
                listeProposition = listeMot
            } else {
                // Sinon nous voulons jouer avec la liste des phrases
                listeProposition = listePhrase
            }
            inputEcriture.value = ""
            // Et on modifie l'affichage en direct. 
            afficherProposition(listeProposition[i])
        })
    }

    // Gestion de l'événement submit sur le formulaire de partage. 
    let form = document.querySelector("form")
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        let scoreEmail = `${score} / ${i}`
        gererFormulaire(scoreEmail)
    })
 }