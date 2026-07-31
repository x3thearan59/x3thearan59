(() => {
    const LINKS_API = "https://script.google.com/macros/s/AKfycbxpg2tBG2KhMAjEQE_lRbaalCUgqJqXpV_bRUgdC11YSeWDXz3VhPGHggBr6QoTU5iH4g/exec";
    const linksContainer =
    document.querySelector(".site-list");
    const linksTemplate =
    document.querySelector(".site-link");
    if (!linksContainer || !linksTemplate) {
        console.error("Site link elements missing");
        return;
    }
    // Hide template
    linksTemplate.style.display = "none";
    fetch(LINKS_API)
    .then(response => {
        if(!response.ok){
            throw new Error("API request failed");
        }
        return response.json();
    })
    .then(data => {
        console.log("Links Data:", data);
        const fragment =
        document.createDocumentFragment();
        data.forEach(item => {
            const linkCard =
            linksTemplate.cloneNode(true);
            linkCard.style.display = "flex";
            
            linkCard.href = item.link;
            linkCard.target = "_blank";
            linkCard.rel = "noopener noreferrer";
            
            const linkIcon =
            linkCard.querySelector(".site-icon");
            const linkName =
            linkCard.querySelector(".site-name");
            if(linkIcon){
                linkIcon.src =
                item.image;
                linkIcon.loading =
                "lazy";
            }
            if(linkName){
                linkName.textContent =
                item.title;
            }
            fragment.appendChild(linkCard);
        });
        linksContainer.appendChild(fragment);
        // Remove template after cloning
        linksTemplate.remove();
    })
    .catch(error => {
        console.error(
            "Links API Error:",
            error
        );
    });
})();

(() => {
const VIDEO_API = "https://script.google.com/macros/s/AKfycbzbl0K-BPubzAPJ5rPEp_qBIr9QKvGe8JvKC-G95U_bv6Yi-jl_RPf9S_AQHfcJUsLP/exec";
let videoNextPageToken = "";
let videoLoading = false;
let videoFinished = false;
const videoContainer =
document.querySelector(".video-list");
const videoTemplate =
document.querySelector(".video-card");
const videoSkeletonTemplate =
document.querySelector(".video-skeleton");
if(!videoContainer || !videoTemplate) return;
function showVideoSkeleton(amount = 5){
    if(!videoSkeletonTemplate) return;
    for(let i = 0; i < amount; i++){
        const skeleton =
        videoSkeletonTemplate.cloneNode(true);
        skeleton.style.display = "block";
        skeleton.classList.remove("video-skeleton");
        skeleton.classList.add("loading-skeleton");
        videoContainer.appendChild(skeleton);
    }
}
function removeVideoSkeleton(){
    document
    .querySelectorAll(".loading-skeleton")
    .forEach(el => el.remove());
}
function loadVideos(){
    if(videoLoading || videoFinished) return;
    videoLoading = true;
    const callbackName =
    "youtubeCallback_" + Date.now();
    window[callbackName] = function(data){
        console.log("Video Data:", data);
        removeVideoSkeleton();
        videoNextPageToken =
        data.nextPageToken || "";
        if(!videoNextPageToken){
            videoFinished = true;
        }
        data.videos.forEach(video => {
            const videoCard =
            videoTemplate.cloneNode(true);
            videoCard.style.display = "block";
            videoCard.dataset.id =
            video.videoId;
            const thumbnail =
            videoCard.querySelector(".video-thumbnail");
            const title =
            videoCard.querySelector(".video-title");
            const views =
            videoCard.querySelector(".video-views");
            const date =
            videoCard.querySelector(".video-date");
            if(thumbnail){
                thumbnail.src =
                video.thumbnail;
            }
            if(title){
                title.textContent =
                video.title;
            }
            if(views){
                views.textContent =
                Number(video.views).toLocaleString()
                + " views";
            }
            if(date){
                date.textContent =
                new Date(video.published)
                .toLocaleDateString();
            }
            videoContainer.appendChild(videoCard);
        });
        videoLoading = false;
        delete window[callbackName];
    };
    let videoURL =
    VIDEO_API +
    "?callback=" +
    callbackName;
    if(videoNextPageToken){
        videoURL +=
        "&pageToken=" +
        encodeURIComponent(videoNextPageToken);
    }
    const jsonpScript =
    document.createElement("script");
    jsonpScript.src = videoURL;
    jsonpScript.onerror = () => {
        console.error("Video API failed");
        videoLoading = false;
    };
    document.body.appendChild(jsonpScript);
}
videoTemplate.style.display = "none";
if(videoSkeletonTemplate){
    videoSkeletonTemplate.style.display = "none";
}
showVideoSkeleton(6);
loadVideos();
const videoScroll =
document.querySelector(".horizontal-scroll");
if(videoScroll){
    videoScroll.addEventListener("scroll", () => {
        const distanceFromEnd =
        videoScroll.scrollWidth -
        (
            videoScroll.scrollLeft +
            videoScroll.clientWidth
        );
        if(distanceFromEnd < 500){
            if(!videoLoading && !videoFinished){
                showVideoSkeleton(2);
                loadVideos();
            }
        }
    });
}
})();

  document.querySelectorAll(".horizontal-scroll").forEach((container) => {
    let targetScroll = container.scrollLeft;
    let currentScroll = container.scrollLeft;
    let animationFrame;
    function animate() {
        currentScroll += (targetScroll - currentScroll) * 0.1;
        if (Math.abs(targetScroll - currentScroll) < 0.1) {
            currentScroll = targetScroll;
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        container.scrollLeft = currentScroll;
        if (animationFrame) {
            animationFrame = requestAnimationFrame(animate);
        }
    }
    function updateScroll(delta) {
        targetScroll += delta;
        targetScroll = Math.max(
            0,
            Math.min(targetScroll, container.scrollWidth - container.clientWidth)
        );
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(animate);
        }
    }
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        updateScroll(e.deltaY);
    }, { passive: false });
});

  document.addEventListener("click", function(e){
    const card = e.target.closest(".video-card");
    if(!card) return;
    const videoID = card.dataset.id;
    const modal = document.querySelector(".video-modal");
    const iframe = document.querySelector(".video-iframe");
    iframe.src =
    `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0`;
    modal.classList.add("active");
});
  document.querySelector(".video-modal-overlay")
.addEventListener("click",()=>{
    const modal =
    document.querySelector(".video-modal");
    const iframe =
    document.querySelector(".video-iframe");
    modal.classList.remove("active");
    iframe.src="";
});
