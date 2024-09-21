// Fungsi untuk split file VCF
function splitVCF() {
    const fileInput = document.getElementById('vcfFile');
    const contactsPerFile = parseInt(document.getElementById('contactsPerFile').value);
    const fileNameBase = document.getElementById('fileName').value || 'split_vcf';  // Nama dasar file

    if (!fileInput.files.length) {
        alert("Pilih file VCF terlebih dahulu!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const vcfData = event.target.result.split('\n');
        let contactCount = 0;
        let currentVCF = [];
        let fileIndex = 1;

        vcfData.forEach(line => {
            currentVCF.push(line);
            if (line.startsWith('END:VCARD')) {
                contactCount++;
                if (contactCount >= contactsPerFile) {
                    // Menyimpan file split dengan nama berdasarkan input pengguna
                    downloadVCF(currentVCF.join('\n'), `${fileNameBase}_${fileIndex}.vcf`);
                    currentVCF = [];
                    contactCount = 0;
                    fileIndex++;
                }
            }
        });

        if (currentVCF.length > 0) {
            downloadVCF(currentVCF.join('\n'), `${fileNameBase}_${fileIndex}.vcf`);
        }

        alert("VCF berhasil di-split!");
    };

    reader.readAsText(file);
}

// Fungsi untuk konversi VCF ke TXT
function convertVCFToTxt() {
    const fileInput = document.getElementById('vcfFileToTxt');

    if (!fileInput.files.length) {
        alert("Pilih file VCF terlebih dahulu!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const vcfData = event.target.result;
        const phoneNumbers = [];

        vcfData.split('\n').forEach(line => {
            if (line.startsWith('TEL')) {
                const number = line.split(':')[1].trim();
                phoneNumbers.push(number);
            }
        });

        document.getElementById('txtOutput').value = phoneNumbers.join('\n');
        alert("VCF berhasil diubah ke TXT!");
    };

    reader.readAsText(file);
}

// Fungsi untuk mendownload file VCF hasil split
function downloadVCF(data, filename) {
    const blob = new Blob([data], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Fungsi untuk mendownload file TXT hasil konversi
function downloadTxtFile() {
    const txtData = document.getElementById('txtOutput').value;
    
    if (!txtData) {
        alert("Tidak ada data untuk diunduh!");
        return;
    }

    const blob = new Blob([txtData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted_vcf_to_txt.txt';
    link.click();
}