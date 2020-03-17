import * as encryption from "./encryption"
import bip38 from 'bip38'
import wif from 'wif'

describe("encryption", () => {
  describe("encrypt", () => {
    let encryptedValue

    beforeEach(() => {
      jest.spyOn(wif, "decode").mockReturnValue({
        privateKey: "privateKey",
        compressed: true,
      })

      jest.spyOn(bip38, "encrypt").mockReturnValue("encryptedKey")

      encryptedValue = encryption.encrypt("value", "passphrase")
    })

    it("decodes the value as a WIF key", () => {
      expect(wif.decode).toHaveBeenCalledWith("value")
    })

    it("encrypts the decoded key", () => {
      expect(bip38.encrypt).toHaveBeenCalledWith(
        "privateKey",
        true,
        "passphrase",
        undefined,
        { N: 512, r: 8, p: 8 },
      )
    })

    it("returns the encrypted value", () => {
      expect(encryptedValue).toEqual("encryptedKey")
    })
  })

  describe("decrypt", () => {
    let decryptedValue

    beforeEach(() => {
      jest.spyOn(bip38, "decrypt").mockReturnValue({
        privateKey: "privateKey",
        compressed: true,
      })

      jest.spyOn(wif, "encode").mockReturnValue("decryptedValue")

      decryptedValue = encryption.decrypt("value", "passphrase")
    })

    it("decrypts the encrypted value", () => {
      expect(bip38.decrypt).toHaveBeenCalledWith(
        "value",
        "passphrase",
        undefined,
        { N: 512, r: 8, p: 8 },
      )
    })

    it("decodes the value as a WIF key", () => {
      expect(wif.encode).toHaveBeenCalledWith(
        0x80,
        "privateKey",
        true,
      )
    })

    it("returns the decrypted value", () => {
      expect(decryptedValue).toEqual("decryptedValue")
    })
  })

  // describe("reEncrypt", () => {
  //   let encryptedValue
  //   let encryptSpy
  //   let decryptSpy
  //
  //   beforeEach(() => {
  //     jest.clearAllMocks()
  //     encryptionMock.reEncrypt = encryption.reEncrypt
  //     encryptSpy = jest.spyOn(encryptionMock, "encrypt")
  //     decryptSpy = jest.spyOn(encryptionMock, "decrypt")
  //
  //     encryptedValue = encryptionMock.reEncrypt("encryptedValue", "currentPassphrase", "newPassphrase")
  //   })
  //
  //   afterEach(() => {
  //     encryptSpy.mockClear()
  //     decryptSpy.mockClear()
  //   })
  //
  //   it("reEncrypts a value", () => {
  //     expect(decryptSpy).toHaveBeenCalledWith("decryptedValue", "newPassphrase")
  //     expect(encryptSpy).toHaveBeenCalledWith("encryptedValue", "currentPassphrase")
  //     expect(encryptedValue).toEqual("newEncryptedValue")
  //   })
  // })
})
