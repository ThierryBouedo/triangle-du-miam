/*
 * menu.js v0.1.1
 * Projet : Triangle du miam
 * Copyright 2022 Thierry Bouedo
 */


/**
 * Objet de définition de la carte des plats (ou menu)
 * C'est un objet volontairement extrait du code :
 *  1) il sert de référence unique pour l'ensemble de l'application et de ses composants.
 *    De ce fait,
 *      a)  l'index des 'plats' dans le tableau 'menu' pourra être utilisé de 
 *          manière significative (voir le calcul de combinaison des 'plats')
 *      b)  la gestion des emojis et des caractères associés est simplifiée
 *  2) il est aisé de mettre à jour la carte des plats proposés (si le cuisinier est inspiré !)
 */

const fullMenu = [
  { 
    name: "Sushi", 
    emojiHexCodePoint: 0x1F363, 
    emojiString: String.fromCodePoint(0x1F363)
  },
  { 
    name: "Pizza", 
    emojiHexCodePoint: 0x1F355, 
    emojiString: String.fromCodePoint(0x1F355)
  },
  { 
    name: "Végétarien", 
    emojiHexCodePoint: 0x1F966, 
    emojiString: String.fromCodePoint(0x1F966)
  }
];


const menu = fullMenu.map(extract);

function extract(meal) {
  return meal.emojiString;
};