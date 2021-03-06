var obj;
var colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)'];

fetch('https://raw.githubusercontent.com/alhuan/alhuan.github.io/main/_data/all_results.json')
  .then(res => res.json())
  .then(data => obj = data)
  .then(() => console.log(obj))
  .then(() => graphData(obj));

function graphData(obj) {
    var dataset = $("#data_select").val();
    var indexes = $("#indexes").val();

    if (indexes.length == 0) {
        return;
    }

    var indexData = [];
    var idx = 0;
    var largestSize = 0;
    for (const index of indexes) {
        var data = convertSizeLatency(obj[index][dataset]);
        largestSize = Math.max(largestSize, data[data.length - 1].x);
    }
    for (const index of indexes) {
        console.log(largestSize);
        if (dataset in obj[index]) {
            var nextPoint = {
                label: index,
                data: convertSizeLatency(obj[index][dataset]),
                showLine: true,
                tension: 0,
                backgroundColor: colors[idx],
                borderColor: colors[idx],
                fill: false
            }
            if (nextPoint.data.length == 1 && nextPoint.data[0].x == 0) {
                nextPoint.data.push({x: largestSize, y: nextPoint.data[0].y});
                console.log(nextPoint.data);
            }
            indexData.push(nextPoint);
            idx++;
        }
    }

    var ctx = document.getElementById("latencyChart");
    console.log(indexData);
    var chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: indexData
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Size-Latency Pareto Plot'
            },
            scales: {
                xAxes: [{
                    type: 'logarithmic',
                    position: 'bottom',
                    ticks: {
                        userCallback: function(tick) {
                            var remain = tick / (Math.pow(10, Math.floor(Chart.helpers.log10(tick))));
                            if (remain === 1 || remain === 2 || remain === 5) {
                                return getSizeStr(tick);
                            }
                            return '';
                        },
                    },
                    scaleLabel: {
                        labelString: 'Size',
                        display: true,
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        userCallback: function(tick) {
                            return tick.toString() + 'ns';
                        }
                    },
                    scaleLabel: {
                        labelString: 'Latency',
                        display: true
                    }
                }]
            },
            tooltips: {
                mode: 'index'
            },
        }
    });
    $('#indexes').on('change', function(e) {
        console.log("index changed");
        chart.destroy();
    });
    
    $("#data_select").on('change', function(e) {
        console.log("select changed");
        chart.destroy();
    });
}

function convertSizeLatency(dataset) {
    result = [];
    for (const dat of dataset) {
        result.push({
            x: dat.size,
            y: dat.latency
        })
    }
    result.sort(function(a, b) {
        return a.x - b.x;
    });
    return result;
}

function getSizeStr(num) {
    if (num < 1e6) {
        return (Math.round(num / 1000)).toString() + " KB";
    } else if (num < 1e9) {
        return (Math.round(num / 1e6)).toString() + " MB";
    } else {
        return (Math.round(num / 1e9)).toString() + " GB";
    }
}

$('#indexes').on('change', function(e) {
    graphData(obj);
    console.log($("#indexes").val());
})

$("#data_select").on('change', function(e) {
    graphData(obj);
    console.log($("#data_select").val());
})