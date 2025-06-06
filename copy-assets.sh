#!/bin/bash

# Создаем директорию для изображений в public
mkdir -p public/quiz_images

# Копируем JSON файл с данными
cp ../quiz_data.json public/

# Копируем изображения
cp ../quiz_images/* public/quiz_images/ 