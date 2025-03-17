import {
    SiAew,
    SiNotion,
    SiSlack,
    SiGoogle,
    SiDropbox,
    SiZapier,
    SiTrello,
    SiHubspot,
    SiJira,
    SiMongodb,
    SiAsana,
    SiAtlassian,
    SiBitbucket,
    SiGit,
    SiGithub,
    SiGitlab,
    SiDocker,
    SiKubernetes,
    SiGooglecloud,
    SiFirebase,
    SiHeroku,
    SiNetlify,
    SiVercel,
    SiFigma,
    SiAdobe,
    SiSketch,
    SiInvision,
    SiCloudflare,
    SiDigitalocean,
    SiWordpress,
    SiShopify,
    SiSquarespace,
    SiWix,
    SiWebflow,
    SiDrupal,
    SiJoomla,
    SiMagento,
    SiPrestashop,
    SiMailchimp,
    SiSendgrid,
    SiTwilio,
    SiStripe,
    SiPaypal,
    SiSquare,
    SiVenmo,
    SiZoom,
    SiGoogledrive,
    SiIcloud,
    SiDropbox as SiDropbox2,
    SiBox,
    SiEvernote,
    SiTodoist,
    SiEtsy,
  } from "react-icons/si";
  
  import { FaAws, FaLinode, FaOpencart } from "react-icons/fa";
  
  const icons = [
    { Icon: SiAew, color: "text-red-500" },
    { Icon: SiNotion, color: "text-black" },
    { Icon: SiSlack, color: "text-purple-800" },
    { Icon: SiGoogle, color: "text-blue-500" },
    { Icon: SiDropbox, color: "text-blue-600" },
    { Icon: SiZapier, color: "text-orange-500" },
    { Icon: SiTrello, color: "text-blue-600" },
    { Icon: SiHubspot, color: "text-orange-500" },
    { Icon: SiJira, color: "text-blue-600" },
    { Icon: SiMongodb, color: "text-green-600" },
    { Icon: SiAsana, color: "text-gray-800" },
    { Icon: SiAtlassian, color: "text-blue-600" },
    { Icon: SiBitbucket, color: "text-blue-600" },
    { Icon: SiGit, color: "text-orange-500" },
    { Icon: SiGithub, color: "text-black" },
    { Icon: SiGitlab, color: "text-orange-500" },
    { Icon: SiDocker, color: "text-blue-500" },
    { Icon: SiKubernetes, color: "text-blue-600" },
    { Icon: SiGooglecloud, color: "text-blue-500" },
    { Icon: SiFirebase, color: "text-yellow-500" },
    { Icon: SiHeroku, color: "text-purple-800" },
    { Icon: SiNetlify, color: "text-teal-500" },
    { Icon: SiVercel, color: "text-black" },
    { Icon: SiFigma, color: "text-orange-500" },
    { Icon: SiAdobe, color: "text-red-500" },
    { Icon: SiSketch, color: "text-yellow-500" },
    { Icon: SiInvision, color: "text-pink-500" },
    { Icon: SiCloudflare, color: "text-orange-500" },
    { Icon: SiDigitalocean, color: "text-blue-500" },
    { Icon: FaLinode, color: "text-green-500" },
    { Icon: SiWordpress, color: "text-blue-600" },
    { Icon: SiShopify, color: "text-green-500" },
    { Icon: SiSquarespace, color: "text-black" },
    { Icon: SiWix, color: "text-blue-500" },
    { Icon: SiWebflow, color: "text-blue-600" },
    { Icon: SiDrupal, color: "text-blue-600" },
    { Icon: SiJoomla, color: "text-blue-500" },
    { Icon: SiMagento, color: "text-orange-500" },
    { Icon: SiPrestashop, color: "text-pink-500" },
    { Icon: FaOpencart, color: "text-green-500" },
    { Icon: SiMailchimp, color: "text-yellow-500" },
    { Icon: SiSendgrid, color: "text-green-500" },
    { Icon: SiTwilio, color: "text-red-500" },
    { Icon: SiStripe, color: "text-blue-500" },
    { Icon: SiPaypal, color: "text-blue-800" },
    { Icon: SiSquare, color: "text-gray-700" },
    { Icon: SiVenmo, color: "text-blue-500" },
    { Icon: SiZoom, color: "text-blue-500" },
    { Icon: SiGoogledrive, color: "text-green-500" },
    { Icon: SiIcloud, color: "text-blue-500" },
    { Icon: SiDropbox2, color: "text-blue-600" },
    { Icon: SiBox, color: "text-blue-600" },
    { Icon: SiEvernote, color: "text-green-500" },
    { Icon: SiTodoist, color: "text-red-500" },
    { Icon: FaAws, color: "text-orange-500" },
    { Icon: SiWordpress, color: "text-blue-600" },
    { Icon: SiEtsy, color: "text-green-500" },
  ];
  
  const Integrations = () => {
    return (
      <section className="bg-[#EAF2EF] py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enhance Your Capabilities</h2>
        <p className="text-gray-600 mb-8">
          Respond to new market demands with access to 400+ pre-built apps—and unlock the flexibility to integrate anything with an API.
        </p>
  
        <div className="overflow-hidden max-w-6xl mx-auto">
          {/* para a esquerda */}
          <div className="flex space-x-8 animate-scroll-left">
            {icons.map(({ Icon, color }, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg shadow-md flex items-center justify-center"
              >
                <Icon size={50} className={color} />
              </div>
            ))}
          </div>
  
          {/* icones deslizando para a direita */}
          <div className="flex space-x-8 animate-scroll-right mt-4">
            {[...icons].reverse().map(({ Icon, color }, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg shadow-md flex items-center justify-center"
              >
                <Icon size={50} className={color} />
              </div>
            ))}
          </div>
        </div>
  
        <button className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
          Browse all apps
        </button>
      </section>
    );
  };
  
  export default Integrations;