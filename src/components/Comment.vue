<template>
  <div class="comment-wrap">
    <div class="comment-block">
      <p class="mb-1">
        <strong>{{review.author}}</strong>
      </p>
      <p class="comment-text">{{review.text}}</p>
      <div class="bottom-comment">
        <div class="comment-date">{{review.date | moment("dddd, MMMM Do YYYY, h:mms a")}}</div>
        <ul class="comment-actions">
          <li class="complain">Complain</li>
          <li class="reply">Reply</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['review'],
};
</script>


<style lang="scss" scoped>
$ptsans: "PT Sans", "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif;
$placeholder: #ced2db;
$text-color: #555f77;
$links: #0095ff;

p {
  line-height: 1.3;
  text-align: left;
}

.comment-wrap {
  display: table;
  width: 100%;
  &:not(:first-of-type) {
    padding-top: 1rem;
  }
  &:not(:last-of-type) {
    padding-bottom: 1rem;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-image: linear-gradient(
      to right,
      #cccccc1f 0%,
      #bdbdbd93 50%,
      #cccccc1f 100%
    );
    border-image-slice: 1;
  }
}

.comment-block {
  display: table-cell;
  vertical-align: top;

  textarea {
    width: 100%;
    resize: none;
  }
}

.comment-text {
  margin-bottom: 0.6rem;
}

.bottom-comment {
  color: #acb4c2;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// .comment-date {
// }

.comment-actions {
  display: flex;
  margin-right: 2rem;
  margin-bottom: 0;
  li {
    display: inline;
    margin: -2px;
    cursor: pointer;

    &.complain {
      padding-right: 1rem;
      border-right: 1px solid #e1e5eb;
    }

    &.reply {
      padding-left: 1rem;
    }

    &:hover {
      color: $links;
    }
  }
}
</style>
