# Solvents API Project

## http://localhost:5000/wordsolver/[m,e,k,t,a,p,t,s] -> GET

RES
```json
{
    "word": "HAPSETMEK",
    "score": 15
}
```

## http://localhost:5000/countdownsolver/[2,4,5,7,5,50]/425 -> GET

RES
```json
{
    "result": "50 * 4 * 2 = 400</br>5 * 5 = 25</br>400 + 25 = 425</br>",
    "score": 9
}
```
