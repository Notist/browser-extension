import 'whatwg-fetch';
import path from 'path';
import { URL } from 'isomorphic-url';
import URLSearchParams from 'url-search-params';
import * as types from './constants/ActionTypes';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/* eslint-disable no-undef */

let apiHost;
// @if ENVIRONMENT='production'
apiHost = 'https://notist.herokuapp.com';
// @endif
// @if ENVIRONMENT='development'
apiHost = 'http://localhost:3000';
// @endif

export function updateAuthStatus(isAuthenticated) {
  return {
    type: types.UPDATE_AUTH_STATUS,
    isAuthenticated,
  };
}

function receiveAnnotation(annotation) {
  return {
    type: types.RECEIVE_ANNOTATION,
    annotation,
  };
}

function requestAnnotations() {
  return {
    type: types.REQUEST_ANNOTATIONS,
  };
}

function receiveAnnotations(annotations) {
  return {
    type: types.RECEIVE_ANNOTATIONS,
    annotations,
  };
}

function receiveReply(reply) {
  return {
    type: types.RECEIVE_REPLY,
    reply,
  };
}

function sendCreateAnnotationRequest(dispatch, body) {
  dispatch(requestAnnotations());
  return fetch(path.join(apiHost, 'api/annotation'), {
    method: 'POST',
    credentials: 'include',
    headers,
    body,
  })
  .then((res) => {
    if (res.status === 401) {
      dispatch(updateAuthStatus(false));
      return {};
    } else {
      return res.json();
    }
  })
  .then((json) => {
    if (json.SUCCESS) {
      if (json.SUCCESS.parent) {
        dispatch(receiveReply(json.SUCCESS));
      } else {
        dispatch(receiveAnnotation(json.SUCCESS));
      }
    } else {
      dispatch(fetchAnnotationsFailure());
    }
  })
  .catch((e) => {
    console.log(e);
    dispatch(fetchAnnotationsFailure());
  });
}

export function createAnnotationAsync() {
  return (dispatch, getState) => {
    const { parent, articleText, ranges, markdown, groups, isPublic, articleURI } = getState().articles.newAnnotation;
    const body = {
      parent,
      articleText,
      ranges,
      text: markdown,
      uri: articleURI || getState().articles.currentArticleUrl,
      groups,
      isPublic,
    };
    return sendCreateAnnotationRequest(dispatch, JSON.stringify(body));
  };
}

export function deleteAnnotation(annotationId) {
  return {
    type: types.REQUEST_DELETE_ANNOTATION,
    annotationId,
  };
}

export function handleDeleteAnnotationSuccess(annotationId) {
  return {
    type: types.DELETE_ANNOTATION,
    annotationId,
  };
}

export function deleteAnnotationAsync(annotationId) {
  return (dispatch, getState) => {
    const deleteEndpoint = path.join(apiHost, `api/annotation/${annotationId}`);
    return fetch(deleteEndpoint, {
      method: 'DELETE',
      credentials: 'include',
      headers,
    })
    .then(res => res.json())
    .then((json) => {
      if (json.SUCCESS) {
        dispatch(handleDeleteAnnotationSuccess(annotationId));
      }
    });
  };
}

export function createAnnotation(parent, articleText, ranges, text, groups, isPublic, articleURI) {
  return {
    type: types.CREATE_ANNOTATION,
  };
}

export function fetchAnnotationsAsync() {
  return (dispatch, getState) => {
    const { isFetchingAnnotations, currentArticleUrl } = getState().articles;
    if (isFetchingAnnotations) {
      return Promise.resolve();
    } else {
      const urlString = path.join(apiHost, 'api/article/annotations');
      const annotationsEndpoint = new URL(urlString);
      annotationsEndpoint.search = new URLSearchParams(`?uri=${currentArticleUrl}`);
      dispatch(requestAnnotations());
      return fetch(annotationsEndpoint, {
        method: 'GET',
        credentials: 'include',
        headers,
      })
      .then(res => res.json())
      .then((annotations) => {
        if (annotations.ERROR) {
          console.log(annotations.ERROR);
          dispatch(fetchAnnotationsFailure());
        } else {
          dispatch(receiveAnnotations(annotations));
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch(fetchAnnotationsFailure());
      });
    }
  };
}

function fetchAnnotationsFailure() {
  return {
    type: types.FETCH_ANNOTATIONS_FAILURE,
  };
}

export function fetchAnnotations() {
  return {
    type: types.FETCH_ANNOTATIONS,
  };
}

export function toggleNewComment(annotationId) {
  return {
    type: types.TOGGLE_NEW_COMMENT,
    annotationId,
  };
}

export function toggleCreatingAnnotation() {
  return {
    type: types.TOGGLE_CREATING_ANNOTATION,
  };
}

export function selectAnnotationGroups(groups) {
  return {
    type: types.SELECT_ANNOTATION_GROUPS,
    groups,
  };
}

export function newAnnotation(articleText, ranges, articleURI) {
  return {
    type: types.NEW_ANNOTATION,
    articleText,
    articleURI,
    ranges,
  };
}

export function updateAnnotationMarkdown(markdown) {
  return {
    type: types.UPDATE_ANNOTATION_MARKDOWN,
    markdown,
  };
}

export function updateAnnotationPublic(isPublic) {
  return {
    type: types.UPDATE_ANNOTATION_PUBLIC,
    isPublic,
  };
}

export function updateAnnotationParent(parent) {
  return {
    type: types.UPDATE_ANNOTATION_PARENT,
    parent,
  };
}

export function updateArticleUrl(url) {
  return {
    type: types.UPDATE_ARTICLE_URL,
    url,
  };
}

export function updateUser(newUser) {
  return {
    type: types.UPDATE_USER,
    newUser,
  };
}

export function fetchUserAsync() {
  return (dispatch, getState) => {
    const { isFetchingUser } = getState().user;
    if (isFetchingUser) {
      return Promise.resolve();
    } else {
      return fetch(path.join(apiHost, '/api/user'), {
        method: 'GET',
        credentials: 'include',
        headers,
      })
      .then((res) => {
        if (res.status === 401) {
          dispatch(updateAuthStatus(false));
          return { ERROR: 'Unable to login' };
        } else {
          return res.json();
        }
      })
      .then((user) => {
        if (user.ERROR) {
          console.log(user.ERROR); // TODO: display error message in sidebar
        } else {
          dispatch(updateUser(user));
          dispatch(updateAuthStatus(true));
        }
      });
    }
  };
}

export function fetchUser() {
  return {
    type: types.FETCH_USER,
  };
}

export function createGroup(group) {
  return {
    type: types.CREATE_GROUP,
    group,
  };
}

function handleCreateGroupSuccess(group) {
  return {
    type: types.RECEIVE_GROUP,
    group,
  };
}

export function createGroupAsync(group) {
  return (dispatch, getState) =>
    fetch(path.join(apiHost, '/api/group'), {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(group),
    })
    .then(res => res.json())
    .then((savedGroup) => {
      if (savedGroup.SUCCESS) {
        dispatch(handleCreateGroupSuccess(savedGroup.SUCCESS));
      }
    });
}

export function filterAnnotations(groups) {
  return {
    type: types.FILTER_GROUP,
    groups,
  };
}

export function toggleCollapsed() {
  return {
    type: types.TOGGLE_COLLAPSED,
  };
}
