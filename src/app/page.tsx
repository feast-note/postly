import PostCardTemplate from "@/components/main/PostCardTemplate";
import Video from "@/components/Video";

export default function Home() {
  return (
    <section className="flex items-center flex-col bg-gray-950 h-full">
      <h2 className="text-5xl mt-24 text-white">
        Infinite Canvas, Infinite Ideas
      </h2>
      <div className="flex flex-col justify-center mt-4">
        <div className="flex gap-4 p-4">
          <PostCardTemplate text="N" color="#3680f9" />
          <PostCardTemplate text="O" color="#27ef8e" />
          <PostCardTemplate text="T" color="#ffd150" />
          <PostCardTemplate text="E" color="#c05ded" />
        </div>
      </div>
      <Video
        src={"/video/show-teaser.mov"}
        autoPlay
        muted
        playsInline
        width={"1200"}
        height={"300"}
      ></Video>
    </section>
  );
}
