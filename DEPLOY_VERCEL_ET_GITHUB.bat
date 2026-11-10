@echo off
chcp 65001 >nul
title Deploiement BookMe Cameroun - GitHub (Gift-roi) et Vercel (GIFTINI)
echo ======================================================================
echo   BOOKME CAMEROUN - DEPLOIEMENT AUTOMATIQUE GITHUB ^& VERCEL
echo   Compte GitHub : Gift-roi  ^|  Compte Vercel : GIFTINI
echo ======================================================================
echo.

cd /d "C:\Users\USER\.gemini\antigravity\scratch\bookme"

echo [1/3] Enregistrement des derniers fichiers dans Git...
git add -A
git commit -m "chore: pret pour deploiement Vercel et GitHub" 2>nul

echo.
echo [2/3] Envoi du code sur GitHub (Gift-roi)...
echo (Si une fenetre de connexion GitHub s'ouvre, cliquez sur Authorize)
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Gift-roi/bookme.git
git push -u origin main

echo.
echo [3/3] Deploiement en production sur votre compte Vercel (GIFTINI)...
echo (Si Vercel demande de vous connecter, appuyez sur Entree pour ouvrir le navigateur)
call npx.cmd --yes vercel login
call npx.cmd --yes vercel --prod --yes

echo.
echo ======================================================================
echo   DEPLOIEMENT TERMINE ! Votre lien Vercel est affiche ci-dessus.
echo ======================================================================
pause

