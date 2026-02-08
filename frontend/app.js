let provider;
let signer;
let contract;

const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const abi = [
    "function createCampaign(string,uint256,uint256)",
    "function contribute(uint256) payable"
];

async function connectWallet() {
    if (!window.ethereum) {
        alert("Install MetaMask");
        return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    document.getElementById("account").innerText =
        "Connected: " + await signer.getAddress();

    contract = new ethers.Contract(contractAddress, abi, signer);
}

async function createCampaign() {
    const title = document.getElementById("title").value;
    const goal = document.getElementById("goal").value;
    const duration = document.getElementById("duration").value;

    const tx = await contract.createCampaign(title, goal, duration);
    await tx.wait();

    alert("Campaign created!");
}

async function contribute() {
    const id = document.getElementById("campaignId").value;
    const eth = document.getElementById("amount").value;

    const tx = await contract.contribute(id, {
        value: ethers.parseEther(eth)
    });
    await tx.wait();

    alert("Contribution sent!");
}
