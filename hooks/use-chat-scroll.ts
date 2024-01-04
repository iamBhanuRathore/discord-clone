import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  bottomRef,
  chatRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [canGoToBottom, setCanGoToBottom] = useState(false);
  // Scroll to load more messages
  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
      if (
        !topDiv?.scrollHeight ||
        !topDiv?.scrollTop ||
        !topDiv?.offsetHeight
      ) {
        setCanGoToBottom(false);
        return;
      }
      if (
        topDiv?.scrollHeight - (topDiv?.scrollTop + topDiv?.offsetHeight) >
        200
      ) {
        setCanGoToBottom(true);
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  // Auto-scroll to bottom
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 500;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);

  // Scroll to bottom function
  const backToBottom = () => {
    console.log("back to botton");
    const bottomDiv = bottomRef?.current;
    bottomDiv?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Additional logic or functions can be added here

  // Return any values or functions you want to expose to the component
  // For example, you can return the backToBottom function

  return { backToBottom, canGoToBottom };
};
