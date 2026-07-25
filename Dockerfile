# Nginx cannot run as root.
FROM nginxinc/nginx-unprivileged:alpine3.24-perl@sha256:sha256:233749086c407d88308169f2668c04965e56506b120ccf94fbf12ba7f8c608cc

# Only required files enter the image.
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 codes/ /usr/share/nginx/html/codes/
COPY --chown=101:101 media/ /usr/share/nginx/html/media/

# Subsequent commands (including when the container starts) should run as the user with UID 101 and GID 101
USER 101:101
EXPOSE 8080