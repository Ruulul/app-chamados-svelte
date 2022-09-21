<script>
    import { onMount } from "svelte";
    import QRCode from 'qrcode';
    import QrScanner from "qr-scanner";

    let qrcodeel;
    let qrcode;

    onMount(async ()=>{
        await makeCode("Wooooo");
        await readCode().then(console.log);
    })

    async function makeCode(code) {
        return new Promise(function (res, rej) {
            QRCode.toCanvas(qrcodeel, code, err=>{
                if (err) return rej(err);
                res();
            });
        })
    }
    async function readCode() {
        return await QrScanner.scanImage(qrcodeel, { returnDetailedScanResult: true }).then(info=>info.data);
    }
</script>
<canvas bind:this={qrcodeel}/>