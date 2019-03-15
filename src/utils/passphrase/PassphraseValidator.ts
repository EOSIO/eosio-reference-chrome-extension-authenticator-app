export interface PassphraseRequirements {
  isLong: boolean
  isUnique: boolean
  isMatching: boolean
}

export default class PassphraseValidator {
  public validatePassphrase(passphrase: string, confirmPassphrase: string): PassphraseRequirements {
    return {
      isLong: this.isLong(passphrase),
      isUnique: this.isUnique(passphrase),
      isMatching: this.isMatching(passphrase, confirmPassphrase)
    }
  }

  public isLong(passphrase: string): boolean {
    return this.getWords(passphrase).length >= 4
  }

  public isUnique(passphrase: string): boolean {
    const words = this.getWords(passphrase)

    return words.every((word) => {
      return words.indexOf(word) === words.lastIndexOf(word)
    })
  }

  public isMatching = (passphrase: string, confirmPassphrase: string) => passphrase === confirmPassphrase

  private getWords = (passphrase: string) => passphrase.trim().split(/\s+/)
}
