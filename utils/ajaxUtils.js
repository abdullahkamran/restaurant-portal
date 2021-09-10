export const ajaxFetch = (
  { url, method = 'GET', body, contentType = 'application/json', withCredentials = false },
  responseCallback,
) => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
      responseCallback && responseCallback(xhr);
    }
  }
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', contentType);
  xhr.withCredentials = withCredentials;

  if (contentType === 'application/json') {
    xhr.send(JSON.stringify(body));
  }
  else {
    xhr.send(body);
  }
};