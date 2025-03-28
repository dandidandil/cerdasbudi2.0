document.addEventListener('DOMContentLoaded', function() {
    // Color palettes
    const primaryColors = [
        'rgba(67, 56, 202, 0.7)',
        'rgba(79, 70, 229, 0.7)',
        'rgba(99, 102, 241, 0.7)',
        'rgba(129, 140, 248, 0.7)',
        'rgba(165, 180, 252, 0.7)'
    ];
    
    const secondaryColors = [
        'rgba(220, 38, 38, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(248, 113, 113, 0.7)',
        'rgba(252, 165, 165, 0.7)',
        'rgba(254, 202, 202, 0.7)'
    ];
    
    // Suicide Cases Chart - Mixed Chart (Line & Bar)
    const suicideCtx = document.getElementById('suicideChart').getContext('2d');
    
    const suicideData = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                type: 'bar',
                label: 'Kasus Bunuh Diri Remaja',
                data: [53, 58, 64, 71, 80, 92],
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
            },
            {
                type: 'bar',
                label: 'Kasus Terkait Perundungan',
                data: [24, 28, 34, 42, 51, 62],
                backgroundColor: 'rgba(129, 140, 248, 0.7)',
                borderColor: 'rgba(129, 140, 248, 1)',
                borderWidth: 1
            },
            {
                type: 'line',
                label: 'Persentase Kasus Terkait Perundungan (%)',
                data: [45, 48, 53, 59, 64, 67],
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };
    
    const suicideChart = new Chart(suicideCtx, {
        type: 'bar',
        data: suicideData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Kasus'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Persentase (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
    
    // School Bullying Impact Chart - Bar & Line Combined
    const schoolBullyingCtx = document.getElementById('schoolBullyingChart').getContext('2d');
    
    const schoolData = {
        labels: ['Penurunan Prestasi', 'Masalah Kesehatan Mental', 'Ketidakhadiran', 'Isolasi Sosial', 'Masalah Perilaku'],
        datasets: [
            {
                type: 'bar',
                label: 'Jumlah Siswa Terdampak (dalam ribuan)',
                data: [486, 572, 348, 426, 298],
                backgroundColor: primaryColors,
                borderColor: 'rgba(79, 70, 229, 0.8)',
                borderWidth: 1
            },
            {
                type: 'line',
                label: 'Persentase Siswa Terdampak (%)',
                data: [42, 49, 30, 37, 26],
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(220, 38, 38, 1)',
                pointRadius: 5,
                yAxisID: 'y1'
            }
        ]
    };
    
    const schoolBullyingChart = new Chart(schoolBullyingCtx, {
        type: 'bar',
        data: schoolData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Siswa (dalam ribuan)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Persentase (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
    
    // Regional Data Chart - Horizontal Bar
    const regionalCtx = document.getElementById('regionalChart').getContext('2d');
    
    const regionalData = {
        labels: ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Banten', 'Sumatera Utara', 'Sulawesi Selatan', 'Bali', 'DI Yogyakarta'],
        datasets: [{
            label: 'Jumlah Kasus Perundungan',
            data: [4850, 3927, 3245, 2187, 1982, 1765, 1623, 1484],
            backgroundColor: primaryColors,
            borderColor: primaryColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1
        }]
    };
    
    const regionalChart = new Chart(regionalCtx, {
        type: 'bar',
        data: regionalData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Kasus'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
    
    // Bullying Types Chart - Radar
    const bullyingTypesCtx = document.getElementById('bullyingTypesChart').getContext('2d');
    
    const bullyingTypesData = {
        labels: [
            'Verbal', 
            'Fisik', 
            'Sosial/Relasional', 
            'Cyber', 
            'Seksual', 
            'Diskriminasi'
        ],
        datasets: [{
            label: 'Persentase Kasus',
            data: [78, 56, 64, 72, 31, 45],
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointRadius: 4
        }]
    };
    
    const bullyingTypesChart = new Chart(bullyingTypesCtx, {
        type: 'radar',
        data: bullyingTypesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Sexual Harassment Chart - Line
    const sexualHarassmentCtx = document.getElementById('sexualHarassmentChart').getContext('2d');
    
    const sexualHarassmentData = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
            label: 'Kasus Pelecehan Seksual',
            data: [1245, 1678, 2120, 2568, 3365, 3782],
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    const sexualHarassmentChart = new Chart(sexualHarassmentCtx, {
        type: 'line',
        data: sexualHarassmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Kasus'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gender Ratio Chart - Pie
    const genderRatioCtx = document.getElementById('genderRatioChart').getContext('2d');
    
    const genderRatioData = {
        labels: ['Perempuan', 'Laki-laki'],
        datasets: [{
            data: [76, 24],
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)',
                'rgba(79, 70, 229, 0.7)'
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(79, 70, 229, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const genderRatioChart = new Chart(genderRatioCtx, {
        type: 'pie',
        data: genderRatioData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Program Effectiveness Chart - Polararea
    const programEffectivenessCtx = document.getElementById('programEffectivenessChart').getContext('2d');
    
    const programEffectivenessData = {
        labels: [
            'Pelatihan Guru', 
            'Edukasi Siswa', 
            'Sistem Pelaporan', 
            'Konseling', 
            'Keterlibatan Orang Tua'
        ],
        datasets: [{
            label: 'Tingkat Efektivitas (%)',
            data: [74, 68, 62, 85, 59],
            backgroundColor: primaryColors,
            borderColor: primaryColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1
        }]
    };
    
    const programEffectivenessChart = new Chart(programEffectivenessCtx, {
        type: 'polarArea',
        data: programEffectivenessData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
});