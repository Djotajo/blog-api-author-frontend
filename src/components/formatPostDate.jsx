function FormatPostDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short", // e.g., "Jul"
    day: "numeric", // e.g., "2"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export default FormatPostDate;
