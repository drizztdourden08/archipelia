# @layer tooling-scripts @kind build
# Managed by brock sync: the server image. The build context is made by brock server package.
FROM debian:trixie-slim
ARG TARGETARCH
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates tini bubblewrap \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --system --uid 10001 --user-group --home-dir /data --no-create-home --shell /usr/sbin/nologin archipelia \
 && mkdir /data \
 && chown 10001:10001 /data
ADD bundle-${TARGETARCH}.tar.gz /opt/
ENV BROCK_DATA_DIR=/data
VOLUME /data
USER 10001:10001
EXPOSE 38290 38281
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD ["/opt/archipelia/bin/archipelia-server", "health"]
ENTRYPOINT ["tini", "--", "/opt/archipelia/bin/archipelia-server"]
