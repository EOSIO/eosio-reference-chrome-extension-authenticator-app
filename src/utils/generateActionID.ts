const generateActionID: (action: any) => string =
  (action) => JSON.stringify(action).replace(/[^a-zA-Z0-9.]/g, '')

export default generateActionID
