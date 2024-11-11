import LoadScriptMaps from "./LoadScriptMaps";

export default async function Home() {

  const apiKeyProps = await process.env.API_KEY;

  return (
    <div className='mx-2 my-2 gap-4 content-center ...'>
      <LoadScriptMaps apikey={apiKeyProps}></LoadScriptMaps>
    </div>
  );
}
