import Feed from "./Feed";

const Home = () => (
  <section className="w-full flex flex-col items-center justify-start mt-10 px-5 sm:px-10 md:px-20">
    <h1 className="head_text">Welcome to BlogSpot</h1>
    <Feed />
  </section>
);

export default Home;
