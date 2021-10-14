import camelize from "camelize";

function normalizeRecord(data) {
  const relationships = {};
  if (data.relationships && data.relationships !== []) {
    Object.keys(data.relationships).forEach((key) => {
      const relationshipData = data.relationships[key].data;
      if (Array.isArray(relationshipData)) {
        relationships[key] = relationshipData.map((hash) => hash.id);
      } else {
        if (relationshipData === null) {
          return;
        }
        relationships[key] = relationshipData.id;
      }
    });
  }
  const record = {
    id: data.id,
    ...data.attributes,
    ...relationships,
    ...data.meta,
  };
  return {
    type: camelize(data.type),
    record,
  };
}

export function normalizeError(data) {
  if (!data.errors) {
    throw Error(data);
  }

  return data.errors.reduce((memo, error) => {
    if (error.source && error.source.pointer) {
      const key = camelize(
        error.source.pointer.replace(/\/data\/attributes\//, "")
      );
      memo[key] = error.detail;
    }
    return memo;
  }, {});
}

export function normalize(result) {
  let records = [];
  if (Array.isArray(result.data)) {
    records = records.concat(result.data.map((data) => normalizeRecord(data)));
  } else {
    records.push(normalizeRecord(result.data));
  }
  if (result.included) {
    records = records.concat(
      result.included.map((data) => normalizeRecord(data))
    );
  }

  return records.reduce((memo, { type, record }) => {
    if (!memo[type]) {
      memo[type] = {};
    }
    memo[type][record.id] = camelize(record);
    return memo;
  }, {});
}

export function sessionWithUser(result) {
  return {
    expireAfter: result.data.attributes["expire-after"] * 1000,
    session: {
      token: result.data.attributes.token,
    },
    user: {
      id: result.included[0].id,
      ...camelize(result.included[0].attributes),
    },
  };
}
