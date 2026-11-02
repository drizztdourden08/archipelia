/* @layer client-kit @kind logic */

const withSeat = <T extends object>(hello: T, seat: string | undefined): T & { seat?: string } => (seat === undefined ? hello : { ...hello, seat });

export { withSeat };
