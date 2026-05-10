# Checklist avant mise en production

## Supabase
- [ ] Réactiver la confirmation email (Authentication → Configuration → "Enable email confirmations")
- [ ] Changer le mot de passe de la base de données
- [ ] Vérifier que toutes les politiques RLS sont bien en place

## App
- [ ] Remplacer les spots de test par les vraies adresses
- [ ] Tester le flow complet (inscription → confirmation email → connexion)
