function addRow() {
    const tableBody = document.getElementById('pointsTable')
    const newRow = document.createElement('tr')
    newRow.innerHTML = ` 
        <td><input type="number" class="x-input" placeholder="x"></td>
        <td><input type="number" class="y-input" placeholder="y"></td>
        <td><button onclick="removeRow(this)">Удалить</button></td>
    `; //создали содержимое строки
    tableBody.appendChild(newRow) //добавили строку в тело
}

function removeRow(button) {
    const row = button.parentNode.parentNode // нашла родительский элемент строки для удаления
    row.parentNode.removeChild(row) //удаление из родителя
}

function calculateLagrange() { 
    const xValue = parseFloat(document.getElementById('x').value)
    if (isNaN(xValue)) { 
        alert("Введите значение Х для интерполяции") // сообщение об ошибке 
        return // прекращаем выполнение функции 
    } 

    const points = []; 
    const xInputs = document.querySelectorAll('.x-input') // все поля для x 
    const yInputs = document.querySelectorAll('.y-input') // все поля для y 

    for (let i = 0; i < xInputs.length; i++) { 
        const x = parseFloat(xInputs[i].value) // из строки в число 
        const y = parseFloat(yInputs[i].value) 
        if (xInputs[i].value.trim() === "" || yInputs[i].value.trim() === "") { // проверка на пустое значение 
            alert("Ошибка: недостаточно данных! \nВведите значения для всех полей"); // сообщение об ошибке 
            return; // прекращаем выполнение функции 
        } 
        if (!isNaN(x) && !isNaN(y)) { 
            points.push({x, y}) // добавление в массив 
        } 
    } 
    console.log(points)
    if (points.length < 2) { 
        alert("Ошибка: недостаточно данных! \nДобавьте ещё хотя бы одну точку") // сообщение об ошибке 
        return; // прекращаем выполнение функции 
    } else { 
        const resultDiv = document.getElementById('result');  
        let resultInterpolate = LagrangeInterpolation(points, xValue).toFixed(3) // получение значения интерполяции 
        resultDiv.innerHTML = "Интерполяционное значение f(" + xValue + ") = " + resultInterpolate 
        plotLagrange(points)
    } 
} 

function LagrangeInterpolation(points, x) {
    let result = 0
    const n = points.length

    for (let i = 0; i < n; i++) {
        let term = points[i].y // y-координата точки
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                term *= (x - points[j].x) / (points[i].x - points[j].x)
            }
        }
        result += term;
    }

    return result;
}

let chart; // Переменная для хранения экземпляра графика

function plotLagrange(points) {  
    const xValues = [] 
    const yValues = []  

    const minX = Math.min(...points.map(p => p.x))  
    const maxX = Math.max(...points.map(p => p.x)) 
    const step = (maxX - minX) / 100

    for (let x = minX-step*3; x <= maxX+step*3; x += step) {  
        xValues.push(x.toFixed(2));  
        yValues.push(parseFloat(LagrangeInterpolation(points, x).toFixed(3)));  
    }  
    console.log(yValues)
    const ctx = document.getElementById('interpolationChart');
    if (!ctx) {
        console.error("Element 'interpolationChart' not found in DOM.");
        return; 
    }
    const context = ctx.getContext('2d');  

    if (chart) {  
        chart.destroy();  
    }  
    chart = new Chart(context, {  
        type: 'line',  
        data: {  
            labels: xValues,  
            datasets: [  
                {  
                    label: 'Интерполяция Лагранжа',  
                    data: yValues,  
                    borderColor: 'blue',  
                    borderWidth: 2,  
                    fill: false  
                },  
                {  
                    label: 'Исходные точки',  
                    data: points.map(p => ({ x: p.x, y: p.y })),
                    borderColor: 'red',  
                    borderWidth: 5,  
                    pointRadius: 5,  
                    type: 'scatter'
                }  
            ]  
        },  
        options: {  
            scales: {  
                x: { 
                    type: 'linear',
                    min : minX-step*3,
                    max : maxX+step*3,
                    title: {  
                        display: true,  
                        text: 'X'  
                    }  
                },  
                y: {  
                    type: 'linear',
                    title: {  
                        display: true,  
                        text: 'Y'  
                    }  
                }  
            }  
        }  
    }); 
}
