const axios = require("axios");
const findProviders = async (req, res) => {
  try {
    const { city, specialty } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const indianHospitals = {
      "mumbai": [
        { name: "Lilavati Hospital", specialty: "Multi-Specialty", address: { line1: "Bandra Reclamation", city: "Mumbai", state: "Maharashtra", zip: "400050" }, phone: "022-2675-1000" },
        { name: "Kokilaben Dhirubhai Ambani Hospital", specialty: "Multi-Specialty", address: { line1: "Andheri West", city: "Mumbai", state: "Maharashtra", zip: "400053" }, phone: "022-3066-6666" },
        { name: "Hinduja Hospital", specialty: "Multi-Specialty", address: { line1: "Mahim", city: "Mumbai", state: "Maharashtra", zip: "400016" }, phone: "022-2445-1515" },
        { name: "Breach Candy Hospital", specialty: "Multi-Specialty", address: { line1: "Bhulabhai Desai Road", city: "Mumbai", state: "Maharashtra", zip: "400026" }, phone: "022-2367-3888" }
      ],
      "delhi": [
        { name: "AIIMS Delhi", specialty: "Multi-Specialty", address: { line1: "Ansari Nagar East", city: "New Delhi", state: "Delhi", zip: "110029" }, phone: "011-2658-8500" },
        { name: "Fortis Hospital Vasant Kunj", specialty: "Multi-Specialty", address: { line1: "Vasant Kunj", city: "New Delhi", state: "Delhi", zip: "110070" }, phone: "011-4277-6222" },
        { name: "Apollo Hospital Sarita Vihar", specialty: "Multi-Specialty", address: { line1: "Sarita Vihar", city: "New Delhi", state: "Delhi", zip: "110076" }, phone: "011-7179-1090" },
        { name: "Max Super Speciality Hospital", specialty: "Multi-Specialty", address: { line1: "Saket", city: "New Delhi", state: "Delhi", zip: "110017" }, phone: "011-2651-5050" }
      ],
      "bangalore": [
        { name: "Manipal Hospital", specialty: "Multi-Specialty", address: { line1: "HAL Airport Road", city: "Bangalore", state: "Karnataka", zip: "560017" }, phone: "080-2502-4444" },
        { name: "Narayana Health City", specialty: "Cardiac Care", address: { line1: "Bommasandra", city: "Bangalore", state: "Karnataka", zip: "560099" }, phone: "080-7122-2222" },
        { name: "Apollo Hospital Bannerghatta", specialty: "Multi-Specialty", address: { line1: "Bannerghatta Road", city: "Bangalore", state: "Karnataka", zip: "560076" }, phone: "080-2630-4050" },
        { name: "Fortis Hospital Cunningham Road", specialty: "Multi-Specialty", address: { line1: "Cunningham Road", city: "Bangalore", state: "Karnataka", zip: "560052" }, phone: "080-6621-4444" }
      ],
      "hyderabad": [
        { name: "KIMS Hospital", specialty: "Multi-Specialty", address: { line1: "Minister Road Secunderabad", city: "Hyderabad", state: "Telangana", zip: "500003" }, phone: "040-4488-5000" },
        { name: "Apollo Hospital Jubilee Hills", specialty: "Multi-Specialty", address: { line1: "Jubilee Hills", city: "Hyderabad", state: "Telangana", zip: "500033" }, phone: "040-2360-7777" },
        { name: "Yashoda Hospital", specialty: "Multi-Specialty", address: { line1: "Raj Bhavan Road", city: "Hyderabad", state: "Telangana", zip: "500082" }, phone: "040-4567-4567" }
      ],
      "chennai": [
        { name: "Apollo Hospital Greams Road", specialty: "Multi-Specialty", address: { line1: "Greams Road", city: "Chennai", state: "Tamil Nadu", zip: "600006" }, phone: "044-2829-3333" },
        { name: "MIOT International", specialty: "Multi-Specialty", address: { line1: "Mount Poonamallee Road", city: "Chennai", state: "Tamil Nadu", zip: "600089" }, phone: "044-2249-2288" },
        { name: "Fortis Malar Hospital", specialty: "Cardiac Care", address: { line1: "Adyar", city: "Chennai", state: "Tamil Nadu", zip: "600020" }, phone: "044-4289-2288" }
      ],
      "kolkata": [
        { name: "AMRI Hospital", specialty: "Multi-Specialty", address: { line1: "Dhakuria", city: "Kolkata", state: "West Bengal", zip: "700029" }, phone: "033-6680-0000" },
        { name: "Apollo Gleneagles Hospital", specialty: "Multi-Specialty", address: { line1: "Canal Circular Road", city: "Kolkata", state: "West Bengal", zip: "700054" }, phone: "033-2320-3040" },
        { name: "Fortis Hospital Anandapur", specialty: "Multi-Specialty", address: { line1: "Anandapur", city: "Kolkata", state: "West Bengal", zip: "700107" }, phone: "033-6628-4444" }
      ],
      "pune": [
        { name: "Ruby Hall Clinic", specialty: "Multi-Specialty", address: { line1: "Sassoon Road", city: "Pune", state: "Maharashtra", zip: "411001" }, phone: "020-6645-5555" },
        { name: "Jehangir Hospital", specialty: "Multi-Specialty", address: { line1: "Sassoon Road", city: "Pune", state: "Maharashtra", zip: "411001" }, phone: "020-6681-1111" },
        { name: "KEM Hospital", specialty: "Multi-Specialty", address: { line1: "Rasta Peth", city: "Pune", state: "Maharashtra", zip: "411011" }, phone: "020-2612-5600" }
      ],
      "ahmedabad": [
        { name: "Apollo Hospital Ahmedabad", specialty: "Multi-Specialty", address: { line1: "Bhat GIDC Estate", city: "Ahmedabad", state: "Gujarat", zip: "382428" }, phone: "079-6670-1800" },
        { name: "Sterling Hospital", specialty: "Multi-Specialty", address: { line1: "Gurukul Road", city: "Ahmedabad", state: "Gujarat", zip: "380052" }, phone: "079-4002-6500" }
      ]
    };

    const cityLower = city.toLowerCase().trim();
    let providers = indianHospitals[cityLower] || [];

    if (providers.length === 0) {
      providers = [
        { name: "Apollo Hospital", specialty: "Multi-Specialty", address: { line1: "City Centre", city: city, state: "India", zip: "" }, phone: "1860-500-1066" },
        { name: "Fortis Hospital", specialty: "Multi-Specialty", address: { line1: "City Centre", city: city, state: "India", zip: "" }, phone: "1800-111-333" },
        { name: "Max Hospital", specialty: "Multi-Specialty", address: { line1: "City Centre", city: city, state: "India", zip: "" }, phone: "011-2651-5050" }
      ];
    }

    res.json({ success: true, data: { providers, total: providers.length, city: city } });
  } catch (err) {
    console.error("Provider error:", err.message);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};
module.exports = { findProviders };
