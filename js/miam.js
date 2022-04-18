/*
 * miam.js v0.1.1
 * Projet : Triangle du miam
 * Copyright 2022 Thierry Bouedo
 */


/**
 * Gestion de l'application, orientée 'Modèle'
 *
 * Gestion des repas (commandes, prédictions, extractions ...)
 * Conceptuellement :
 *  - un 'repas'(meal) est un 'plat'(dish) associé à une demi-journée (midi ou soir)
 *  - l'ensemble des repas (le triangle) est géré par un tableau construit selon une 
 *    progression chronologique ; l'association index du 'plat'/'plat' constitue un 'repas'.
 */

const model = {
  /**
   * Initialisation du modèle des repas
   * @return 
   */

  init: function() {
    this.mealTriangle = [];
  },

  /**
   * Enregistrement de la commande et calcul de toutes les prédictions de repas
   * @param {String[]} order commande des 14 repas: tableau des strings des emoji
   * @return 
   */

  registerOrderAndPredict: function(order) {
    // Les 14 premiers éléments de triangle sont une copie de la commande
    this.mealTriangle = order.map((x) => x);

    // Prédire la suite
    let lineStart = 14;         // index du premier repas prédit (note : les index commencent à 0)
    let lineLength = 13;        // longueur de la première line du triangle à calculer
  
    while (lineLength > 0){   
      for (i=0; i < lineLength; i++){
        this.mealTriangle.push(
          this.combineTwoDishes(
            this.mealTriangle[lineStart - lineLength - 1 + i], 
            this.mealTriangle[lineStart - lineLength + i]));
      }
      lineStart += lineLength;    // index du premier élément de la ligne suivante
      lineLength--;               // longueur de la ligne suivante
    }
  },

  /**
   * Enregistrement de la commande et calcul de toutes les prédictions
   * @param {Number} day jour (de 1 à 53) à prédire
   * @return {{day: Number, lunch: String, dinner: String}} repas du jour
   */

  getOnePrediction: function(day) {
    let lunch = this.mealTriangle[2 * (day - 1)];
    let dinner = (day == 53)? String.fromCodePoint(0x2753): this.mealTriangle[2 * day - 1];
    return {day: day, lunch: lunch, dinner: dinner};
  },

  /**
   * Calcul de combinaison des plats.
   * 
   * Le calcul est réalisé à partir des index (0, 1 ou 2) des 'plats' dans le tableau 'menu' 
   * donné en référence unique.
   * Une petite table logique montre que si les plats p1 et p2 à combiner sont différents, 
   * alors, le plat résultat p3 vaut (3 - (p1 + p2))
   * 
   * 0   1   2   |r1+r2   r3  (3-(r1+r2))
   * -----------------------------------
   * x   x       | 1      2       2
   * x       x   | 2      1       1
   *     x   x   | 3      0       0
   * 
   * @param {String} d1 premier plat (dish)
   * @param {String} d2 deuxième plat
   * @return {String} plat combiné
   */

  combineTwoDishes: function (d1, d2) {
    if (d1 == d2) 
      return d1;
    else 
      return menu[3 - (menu.indexOf(d1) + menu.indexOf(d2))];
  },

  /**
   * Impression du triangle des repas. Sortie 'console' à des fins de débogage.
   */

  dump: function() {
    let output = "";
    let lineLength = 14;
    let indent = "";
    let count = 0;
    while (lineLength > 0){
      output += indent;
      for (i=0; i < lineLength; i++){
        output += (this.mealTriangle[i + count] + " ");
      }
      console.log (output);
      output = "";
      indent += " ";
      count += lineLength;
      lineLength--;               
    }
  }
}



/**
 * Gestion de l'application, orientée 'Vue'
 * 
 * Gestion de la boite de résultat des prédictions
 */

const resultBox = {
  /**
   * Initialise la boite de résultat
   * @return 
   */
  init: function() {
    this.box = document.getElementById('resultBox');
    this.box.style.display = "none";      // initialisation -> box caché
  },

  /**
   * Montre la boite de résultat
   * @return 
   */
  show: function() {
    this.box.style.display = "block";
  },

  /**
   * Cache la boite de résultat
   * @return 
   */
  hide: function() {
    this.box.style.display = "none";
  },

  /**
   * Rafraichit le contenu du message
   * @param {string[]} order commande des 14 repas: tableau des strings emojis
   * @param {{day: number, lunch: string, dinner: string}} prediction prédiction des repas d'un jour 
   * @return 
   */
  update: function (order, prediction) {
    const message = `
      <p>
        Commande : ${order.join('')}<br \>
        Repas à <strong>J + ${prediction.day}</strong> : midi ${prediction.lunch}, soir ${prediction.dinner}
      </p>
    `;
    this.box.innerHTML = message;
  }
}


/**
 * Gestion de l'application, orientée IHM et 'Contrôleur'
 */

const app = {
  /**
   * Initialise l'application
   * @return 
   */
  init: function() {
    this.form = document.getElementById('inputData');
    this.order = document.getElementById('order');
    this.day = document.getElementById('day');

    // initialise la boite de résultat
    resultBox.init();                 

    // ajoute l'emojiPicker (des plats) sur l'element input (de la commande)
    emojiPicker.init(this.order, menu);

    // création du pattern de vérification de la commande en référence à la carte
    //this.order.setAttribute("pattern", "[\uD83C\uDF55\uD83C\uDF63\uD83E\uDD66]{14}");
    let pattern = "";
    for (let dish of menu) {
      pattern += dish;
    }
    this.order.setAttribute("pattern", "[" + pattern +"]{14}");

    // ajouter les callbacks sur événements
    /*--- Not usefull ---
    // 'click' n'importe où dans la forme -> cacher boite de résultat
    this.form.addEventListener("click", function(event) {
      resultBox.hide()
    }, false);
    ---*/

    // soumission du formulaire
    // remarque : la vérification préalable est confiée au HTML (HTML5 constraint validation)
    this.form.addEventListener("submit", function(event) {
      event.preventDefault();             // pas d'envoi du formulaire via http
      app.submit(event);
    }, false);
  },

  /**
   * Traitement du formulaire
   * @return 
   */
  submit: function(event) {
    model.registerOrderAndPredict(Array.from(this.order.value));
    resultBox.update(
      Array.from(this.order.value),
      model.getOnePrediction (this.day.value));
    resultBox.show();
  }
}
